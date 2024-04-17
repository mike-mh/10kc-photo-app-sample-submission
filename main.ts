import express, { Request, Response } from "express";
import { Application, UserManagementAddon, UserManagementAddonOptions, jsonApiExpress } from "kurier";
import Comment from "./src/resources/Comment";
import Image from "./src/resources/Image";
import CommentProcessor from "./src/processors/CommentProcessor";
import ImageProcessor from "./src/processors/ImageProcessor";
import PrivateImage from "./src/resources/PrivateImage";
import PrivateImageProcessor from "./src/processors/PrivateImageProcessor";
import { connect } from "mongoose";
import VerifiedUser, * as UserResource from './src/resources/VerifiedUser';
import * as dotenv from "dotenv";
import UserResourceProcessor from "./src/processors/VerifiedUserProcessor";
import VerifiedUserProcessor from "./src/processors/VerifiedUserProcessor";
import AuthenticationService from "./src/services/AuthenticationService";
import permissionProvider from "./src/utils/permission-provider";

dotenv.config();


connect(process.env.DB_CONN_STRING as string);

const app = new Application({
  namespace: "api",
  types: [Comment, UserResource.default, Image, PrivateImage],
  defaultProcessor: UserResourceProcessor as any,
  processors: [CommentProcessor as any, UserResourceProcessor, ImageProcessor, PrivateImageProcessor],
});

app.use(UserManagementAddon, {
  userResource: VerifiedUser,
  userProcessor: VerifiedUserProcessor,
  jwtClaimForUserID: 'usr',
  includeTokenInIdentifyOpDataPayload: true,
  userPermissionsProvider: permissionProvider,
} as UserManagementAddonOptions);


const api = express();
api.use(express.json({ limit: '50mb' }));
api.use('/', express.static('./client/dist/client/browser'));
api.use('/api', jsonApiExpress(app));

api.listen(8080, () => {
  console.log(`Example api listening on port ${8080}`)
});

// Leaving out a few custom routes here. Decided to leave them in main for now since there
// were so few I needed to shiv outside of Kurier.js
api.get('/ng/*', (req, res) => {
  res.sendFile(`${__dirname}/client/dist/client/browser/index.html`);
});

api.get('/email-confirmation/:userId/:validationToken', (async (req: Request, res: Response) => {
    await AuthenticationService.getInstance().activateAccount(req.params.userId, req.params.validationToken);
    res.send('Success');
    return null;
  }) as any);

api.post('/login', (async (req: Request, res: Response) => {
  try {
    const token = await AuthenticationService.getInstance().authenticateUserAndIssueTokenWithSession(req.body.email, req.body.password);
    res.send(JSON.stringify({token}));
  }
  catch (e) {
    res.status(403).send('Login failed');
  }
}) as any);

api.get('/current-user', (async (req: Request, res: Response) => {

  if (!req.get('authorization')) {
    res.status(403).send('Unauthorized');
    return;
  }
  const token = req.get('authorization')?.replace('Bearer ', '');

  try {
    const infomration = await AuthenticationService.getInstance().getUserInformationFromToken(token as String);
    res.send(JSON.stringify(infomration));
  }
  catch (e) {
    res.status(403).send('Access denied');
  }
}) as any);
