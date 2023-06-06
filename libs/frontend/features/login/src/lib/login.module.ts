import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { LOGIN_ROUTES } from './login.routes';
import { LoginComponent } from './pages/login/login.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { RegisterComponent } from './pages/register/register.component';
import { SetPasswordComponent } from './pages/set-password/set-password.component';
import { LoginContainerComponent } from './components/login-container/login-container.component';
import { ResetPasswordSentComponent } from './pages/reset-password-sent/reset-password-sent.component';
import { LogoComponent } from './components/logo/logo.component';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    RouterModule.forChild(LOGIN_ROUTES),
    ReactiveFormsModule,
    MatCheckboxModule,
  ],
  declarations: [
    LoginContainerComponent,
    LoginComponent,
    ResetPasswordComponent,
    RegisterComponent,
    SetPasswordComponent,
    ResetPasswordSentComponent,
    LogoComponent,
  ],
})
export class LoginModule {}
