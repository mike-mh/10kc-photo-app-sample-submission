import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { Observable, Subject } from "rxjs";

/* Inspired by post here: https://stackoverflow.com/questions/40393703/rxjs-observable-angular-2-on-localstorage-change */

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private logger = new Subject<boolean>();
    private loggedIn = !!localStorage.getItem('access_token');
    private activeUserId = '';

    constructor() {
        if (!!localStorage.getItem('access_token')) {
            this.activeUserId =
                (jwtDecode(localStorage.getItem('access_token') as string) as any).usr;
        }
    }

    isLoggedIn(): Observable<boolean> {
        return this.logger.asObservable();
    }

    logIn(token: string) {
        if (!token) {
            this.logger.next(this.loggedIn);
            return;
        }
        localStorage.setItem('access_token', token);
        this.loggedIn = true;
        this.activeUserId =
            (jwtDecode(localStorage.getItem('access_token') as string) as any).usr;
        this.logger.next(this.loggedIn);
    }

    logOut() {
        localStorage.removeItem('access_token');
        this.loggedIn = false;
        this.activeUserId = '';
        this.logger.next(this.loggedIn);
    }

    getActiveUserId() {
        return this.activeUserId;
    }
}