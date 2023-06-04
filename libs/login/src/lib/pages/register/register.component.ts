import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'lib-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  readonly registerFormGroup = new FormGroup({
    firstName: new FormControl<string>('', Validators.required),
    lastName: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
    confirmPassword: new FormControl<string>('', Validators.required),
  });

  async registerAsync(): Promise<void> {
    // Needed to clear and check the confirmation error as well.
    this.registerFormGroup.reset(this.registerFormGroup.value);

    this.registerFormGroup.markAllAsTouched();
    if (this.registerFormGroup.invalid) return;

    const { password, confirmPassword } = this.registerFormGroup.value;

    if (password !== confirmPassword) {
      this.registerFormGroup
        .get('password')
        ?.setErrors({ confirmPassword: true });
      this.registerFormGroup
        .get('confirmPassword')
        ?.setErrors({ confirmPassword: true });
      return;
    }

    const { firstName, lastName, email } = this.registerFormGroup.value;

    await this._authService.registerAsync(
      firstName!,
      lastName!,
      email!,
      password!
    );
    await this._router.navigate(['/']);
  }
}
