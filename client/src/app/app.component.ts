import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import 'zone.js';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  signedIn = !!localStorage.getItem('access_token');

  loginStatusObserver = this.userService.isLoggedIn()
    .subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.getUserInfo();
      }
      else {
        this.signedIn = false;
      }
    });
  username = '';

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.signedIn) {
      this.getUserInfo();
      this.http.get('http://localhost:8080/api/privateimage')
        .subscribe((r: any) => {
          if (!!r && !!r.email && !!r.username) {
            this.signedIn = true;
            this.username = r.username
          }
        });
    }
  }

  public logOut() {
    this.userService.logOut();
    this.router.navigate(['ng/public-images-home']);
  }

  private getUserInfo() {
    this.http.get('http://localhost:8080/current-user')
      .subscribe((r: any) => {
        if (!!r && !!r.email && !!r.username) {
          this.signedIn = true;
          this.username = r.username
        }
      });
  }
}
