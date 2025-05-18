import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { AuthGuard } from './shared/auth.guard';
import { publicGuard, authGuard } from './shared/guards/auth/auth.guard';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
        canActivate: [publicGuard]
    },
    {
        path: 'signup',
        loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent),
        canActivate: [publicGuard]
    },
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },    
    {
        path: 'admin-page',
        loadComponent: () => import('./pages/admin-page/admin-page.component').then(m => m.AdminPageComponent),
        canActivate: [authGuard]
    },
    {
        path: 'products',
        loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: '**',
        loadComponent: () => import('./shared/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
    },
    { 
        path: '', redirectTo: '/home', pathMatch: 'full'
    },
    { 
        path: '**', component: PageNotFoundComponent // 404-es oldal
    } 
];