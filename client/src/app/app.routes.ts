import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./login/login.component'),
  },
  {
    path: 'chat',
    loadComponent: () => import('./chat/chat.component'),
  },
];
