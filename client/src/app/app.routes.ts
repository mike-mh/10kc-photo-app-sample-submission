import { Routes } from '@angular/router';
import { PublicImagesComponent } from './public-images/public-images.component';
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: '/', pathMatch: 'full', redirectTo: 'public-images-home' },
    {
      path: 'ng/public-images-home',
      loadChildren: () =>
        import('./public-images/public-images.module').then(m => m.PublicImagesModule),
      component: PublicImagesComponent
    },
    {
      path: 'ng/login',
      loadChildren: () =>
        import('./login/login.module').then(m => m.LoginModule),
      component: LoginComponent
    },
    {
      path: 'ng/create-account',
      loadChildren: () =>
        import('./create-account/create-account.module').then(m => m.CreateAccountModule),
      component: CreateAccountComponent
    },
    {
      path: 'ng/profile',
      loadChildren: () =>
        import('./profile/profile.module').then(m => m.ProfileModule),
      component: ProfileComponent
    },
    
];
