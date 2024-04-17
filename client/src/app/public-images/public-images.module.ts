import { NgModule } from '@angular/core';
import { PublicImagesComponent } from './public-images.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
    {
        path: '',
        component: PublicImagesComponent,
    }
];

@NgModule({
    declarations: [
        PublicImagesComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
        CommonModule,
        BrowserModule,
        HttpClientModule,
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        FormsModule
    ],
    exports: [
        PublicImagesComponent,
        RouterModule
    ]
})
export class PublicImagesModule { }