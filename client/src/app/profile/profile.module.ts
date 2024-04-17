import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ProfileComponent } from './profile.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { JsonApiSerializerService } from '../services/json-api-serializer.service';
import { MatCardModule } from '@angular/material/card';

const routes: Routes = [
    {
        path: '',
        component: ProfileComponent,
    }
];

@NgModule({
    declarations: [
        ProfileComponent,
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
        MatSidenavModule,
        MatCardModule,
        MatButtonToggleModule,
        NgxFileDropModule
    ],
    exports: [
        ProfileComponent,
        RouterModule
    ],
})
export class ProfileModule { }