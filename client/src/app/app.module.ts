import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { routes } from './app.routes';
import { PublicImagesModule } from './public-images/public-images.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        HttpClientModule,
        RouterModule.forRoot(routes),
        CommonModule,
        BrowserModule,
        RouterModule,
        PublicImagesModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
    ],
    exports: [
        RouterModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }