import { Routes } from '@angular/router';

export const routes: Routes = [
  /* { path: 'home', loadComponent: () => import('./pages/home/home') }, */
  { path: 'ask', loadComponent: () => import('./pages/demo1-ask/ask') },
  { path: 'ask2', loadComponent: () => import('./pages/demo2-ask/ask') },
  { path: 'ask3', loadComponent: () => import('./pages/demo3-ask/ask') },
  {
    path: 'images',
    loadComponent: () => import('./pages/images-with-attachment/image-with-attachment'),
  },
  { path: 'chat', loadComponent: () => import('./pages/demo4-chat/chat') },
  { path: 'demo5-multimodal', loadComponent: () => import('./pages/demo5-multimodal/demo5-multimodal') },
  { path: '', pathMatch: 'full', redirectTo: 'ask' },
];
