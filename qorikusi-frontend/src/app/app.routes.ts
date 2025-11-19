import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./modules/home/pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'products',
    loadChildren: () => import('./modules/products/products.routes').then(m => m.PRODUCTS_ROUTES)
  },
  {
    path: 'cart',
    loadComponent: () => import('./modules/cart/pages/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./modules/checkout/pages/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'profile',
    loadChildren: () => import('./modules/profile/profile.routes').then(m => m.PROFILE_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];