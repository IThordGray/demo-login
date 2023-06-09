import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, InvalidCredentialsError } from '../../auth.service';

@Component({
  selector: 'lib-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
})
export class LoginComponent {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  readonly loginFormGroup = new FormGroup({
    email: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required)
  });

  async loginAsync(): Promise<void> {
    // Reset the form to clear any errors
    this.loginFormGroup.reset(this.loginFormGroup.value);

    this.loginFormGroup.markAllAsTouched();
    if (this.loginFormGroup.invalid) return;

    const { email, password } = this.loginFormGroup.value;

    try {
      await this._authService.loginAsync(email!, password!);
      await this._router.navigate([ '/' ]);
    } catch (e) {
      if (e instanceof InvalidCredentialsError) {
        this.loginFormGroup.controls.email.setErrors({ invalidCredentials: true });
        this.loginFormGroup.controls.password.setErrors({ invalidCredentials: true });
        return;
      }
    }
  }

  async loginWithGoogleAsync(): Promise<void> {
    await this._authService.loginWithGoogleAsync();
    await this._router.navigate([ '/' ]);
  }
}
