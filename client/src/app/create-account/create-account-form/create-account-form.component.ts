import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JsonApiSerializerService } from '../../services/json-api-serializer.service';

@Component({
  selector: 'create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrl: './create-account-form.component.css',
})
export class CreateAccountFormComponent {

  hide = true;

  // Wanted to add form validation but it got a bit hairy.
  // Left as a TO-DO
  /*confirmPasswordValidator (
    controlName: string, matchControlName: string
  ): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const matchControl = controls.get(matchControlName);

      if (this.password?.value !== this.passwordConfirm?.value) {
        this.password?.setErrors({
          matching: {
            actualValue: this.password?.value,
            requiredValue: this.passwordConfirm?.value
          }
        });

        this.passwordConfirm?.setErrors({
          matching: {
            actualValue: this.passwordConfirm?.value,
            requiredValue: this.password?.value
          }
        });
        return { matching: true };
      }
      return null;
    };
  };
  
  errorMessage = '';
  */
  userName = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  passwordConfirm = new FormControl('', [Validators.required]);


  constructor(
    private http: HttpClient,
    private jsonApiSerializerService: JsonApiSerializerService,
    private router: Router) { }

  submitForm() {
    this.http.post('http://localhost:8080/api/users',
      this.jsonApiSerializerService.serializeUser(
        {
          email: this.email.value,
          username: this.userName.value,
          password: this.password.value,
        })
    ).subscribe(d => {
      this.router.navigate(['ng/public-images-home']);
    });
  }
}
