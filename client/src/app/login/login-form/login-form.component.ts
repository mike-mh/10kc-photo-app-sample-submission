import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: './login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  hide = true;
  email = new FormControl('', []);
  password = new FormControl('', []);

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {}


  login() {
    this.http.post('http://localhost:8080/login',
    {
      email: this.email.value,
      password: this.password.value,
    }
    ).subscribe(response => {
      this.userService.logIn((response as any).token);
      this.router.navigate(['ng/public-images-home']);
    });
  }
}
