import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginFormComponent } from './login-form/login-form.component';

const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
    }
];

@NgModule({
    declarations: [
        LoginComponent,
        LoginFormComponent
    ],
    imports: [
        RouterModule.forRoot(routes),
        CommonModule,
        BrowserModule,
        HttpClientModule,
        MatIconModule,
        MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
    exports: [
        LoginComponent,
        RouterModule
    ]
})
export class LoginModule { }