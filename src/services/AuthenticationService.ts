import * as bcrypt from 'bcrypt';
import * as jose from 'jose';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import User, { IUser } from "../models/user.model";
import ValidationToken, { IValidationToken } from "../models/validationToken.model";
import { Operation, ResourceAttributes } from 'kurier';
import { createSecretKey, randomBytes } from 'node:crypto';
import validationTokenModel from '../models/validationToken.model';
import VerifiedUser from '../resources/VerifiedUser';

/**
 * Service handles the vast majority of the grunt work for authentication and user management.
 * 
 * There were some more tools in Kurier.js that I probably could have leveraged if I had more
 * time to study the source code but this is a good accessory to it.
 * 
 * Handles strong token validation, password hashing, user creating in DB and sending
 * validation emails.
 */
export default class AuthenticationService {
    private readonly VALID_TOKEN_TIME_IN_MILLISECONDS = 1000 * 60 * (process.env.TOKEN_EXPIRATION_TIME_IN_MINUTES as any);

    private static instance: AuthenticationService;

    private constructor() { }

    public static getInstance(): AuthenticationService {
        if (!AuthenticationService.instance) {
            AuthenticationService.instance = new AuthenticationService();
        }

        return AuthenticationService.instance;
    }

    private async generatePasswordHash(password: String) {
        const salt = await bcrypt.genSalt(+process.env.PASSWORD_HASH_ITERS!);
        const hash = await bcrypt.hash(`${process.env.PASSWORD_PEPPER}${password}`, salt);

        return hash;
    }

    public async login(op: Operation, user: ResourceAttributes) {
        return (
            op.data?.attributes.email === user.email &&
            this.generatePasswordHash(op.data?.attributes.password as String) === user.password
        );
    }

    public async getUserInformationFromToken(token: String): Promise<{}> {
        const tokenIsValid = await this.tokenIsValid(token);

        if (!tokenIsValid) {
            return {};
        }

        const payload = jose.decodeJwt(token as any);

        const user = await User.findById((payload as any).usr, 'username email verified').exec();

        return {
            email: user?.email,
            username: user?.username,
            verified: user?.verified || !!process.env.EMAIL_AUTHENTICATION_BYPASS,
            id: user?.id
        };
    }


    public async authenticateUserAndIssueTokenWithSession(email: string, password: String): Promise<string> {
        const user = await User.findOne({ email }, 'verified sessions password').exec();

        // Add in bypass for demo ease.
        if (!user || (!user.verified && !process.env.EMAIL_AUTHENTICATION_BYPASS)) {
            throw new Error('Invalid user.');
        }

        if (!await bcrypt.compare(`${process.env.PASSWORD_PEPPER}${password}`, user.password)) {
            throw new Error('Invalid login');
        }

        const sessionId = uuidv4();

        const secretKey = createSecretKey((process.env.JWT_SECRET as any), 'utf-8');

        const issueDate = new Date().getTime();
        const expirationDate = issueDate + this.VALID_TOKEN_TIME_IN_MILLISECONDS

        const token = new jose.SignJWT({
            usr: user.id,
            sid: sessionId
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt(issueDate)
            .setIssuer(process.env.JWT_ISSUER as any)
            .setAudience(process.env.JWT_AUDIENCE as any)
            .setExpirationTime(expirationDate)
            .sign(secretKey);

        user.sessions.push({
            sessionId,
            expirationDate
        });

        await user.save();

        return token;
    }

    public async tokenIsValid(token: String): Promise<boolean> {
        try {
            const secretKey = createSecretKey(process.env.JWT_SECRET as any, 'utf-8');

            const { payload } = await jose.jwtVerify(token as any, secretKey, {
                currentDate: new Date(),
                issuer: process.env.JWT_ISSUER,
                audience: process.env.JWT_AUDIENCE,
            });

            const user = await User.findById((payload as any).usr, 'verified sessions').exec();

            // Add bypass for demo purposes
            return !!user && (user.verified || !!process.env.EMAIL_AUTHENTICATION_BYPASS);

        } catch (e) {
            return false;
        }
    }

    public async createNewPendingUser(username: string, email: string, password: string): Promise<VerifiedUser> {
        // Validate no existing users are present.
        const existingUser = await User.findOne({ $or: [{ email }, { username }] }).exec();
        const expirationDate = new Date().getTime() + 1000 * 60 * 60 * (process.env.TOKEN_EXPIRATION_TIME_FOR_VALIDATION_IN_HOURS as any);
        const pendingCode = randomBytes(32).toString("hex");

        // Added an email bypass for ease of demo
        const transport = (!process.env.EMAIL_AUTHENTICATION_BYPASS) ? nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            // NOT SECURE! THIS IS FOR DEMO PURPOSES ONLY!
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            }
        }) : null;

        // Handle the case where the user created an account but didn't verify yet.
        // Trash old verification tokens that may still be in the DB
        if (!!existingUser) {
            if (existingUser?.verified) {
                throw new Error('User already exists.');
            }

            // User exists but isn't validated. Remove pending tokens and make a new one.
            await ValidationToken.deleteMany({ owner: existingUser.id });
            await ValidationToken.create({
                owner: existingUser.id,
                validationToken: pendingCode,
                expirationDate,
            });

            // Added bypass for eas of demo
            if (!!transport) {
                const mailOptions = {
                    from: '"10kc Sample" <sample@10kc.com>',
                    to: email,
                    subject: 'Welcome to the 10KC sample!',
                    html: `<b>Hey there! </b><br>Click the link below and you'll join this great site! <br /><a href="http://localhost:8080/email-confirmation/${existingUser.id}/${pendingCode}">Welcome!</a>`,
                };

                transport.sendMail(mailOptions);
            }

            const userInfo = {
                id: existingUser.id,
                email: existingUser.email,
                username: existingUser.username,
            };

            return userInfo as any;
        }

        const user = await User.create({
            username,
            email,
            password: await this.generatePasswordHash(password),
            sessions: [],
        });

        await ValidationToken.create({
            owner: user.id,
            validationToken: pendingCode,
            expirationDate,
        });

        const mailOptions = {
            from: '"10kc Sample" <sample@10kc.com>',
            to: email,
            subject: 'Welcome to the 10KC sample!',
            html: `<b>Hey there! </b><br>Click the link below and you'll join this great site! <br /><a href="http://localhost:8080/email-confirmation/${user.id}/${pendingCode}">Welcome!</a>`,
        };

        // Added bypass for ease of demo
        if (!!transport) {
            const mailOptions = {
                from: '"10kc Sample" <sample@10kc.com>',
                to: email,
                subject: 'Welcome to the 10KC sample!',
                html: `<b>Hey there! </b><br>Click the link below and you'll join this great site! <br /><a href="http://localhost:8080/email-confirmation/${user.id}/${pendingCode}">Welcome!</a>`,
            };

            transport.sendMail(mailOptions);
        }

        const userInfo = {
            id: user.id,
            email: user.email,
            username: user.username,
        }


        return userInfo as any;

    }

    public async activateAccount(userId: string, activationCode: string): Promise<void> {
        const validationToken = await validationTokenModel.findOne({ owner: userId, validationToken: activationCode })
            .exec();

        if (!validationToken || new Date().getTime() > validationToken.expirationDate) {
            throw new Error('Provided activation is invalid.');
        }

        await User.findOneAndUpdate({ _id: userId }, { verified: true }).exec();
    }
}