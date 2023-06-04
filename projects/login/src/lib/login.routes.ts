import { Routes } from '@angular/router';
import { LoginContainerComponent } from './components/login-container/login-container.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordSentComponent } from './pages/reset-password-sent/reset-password-sent.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { SetPasswordComponent } from './pages/set-password/set-password.component';

export const LOGIN_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'reset-password-sent',
    component: ResetPasswordSentComponent
  },
  {
    path: 'set-password',
    component: SetPasswordComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
