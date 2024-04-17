import { NgModule } from '@angular/core';
import { CreateAccountComponent } from './create-account.component';
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
import { CreateAccountFormComponent } from './create-account-form/create-account-form.component';

const localRoutes: Routes = [
    {
        path: '',
        component: CreateAccountComponent,
    }
];

@NgModule({
    declarations: [
        CreateAccountComponent,
        CreateAccountFormComponent
    ],
    imports: [
        RouterModule.forChild(localRoutes),
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
        CreateAccountComponent,
    ],
    providers: [
    ],
})
export class CreateAccountModule { }