import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'lib-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss'],
})
export class SetPasswordComponent {
  private readonly _authService = inject(AuthService);
  private readonly _activatedRoute = inject(ActivatedRoute);

  readonly setPasswordFormGroup = new FormGroup({
    password: new FormControl<string>('', Validators.required),
    confirmPassword: new FormControl<string>('', Validators.required),
  });

  async setPasswordAsync(): Promise<void> {
    // Needed to clear and check the confirmation error as well.
    this.setPasswordFormGroup.reset(this.setPasswordFormGroup.value);
    this.setPasswordFormGroup.markAllAsTouched();
    if (this.setPasswordFormGroup.invalid) return;

    const { password, confirmPassword } = this.setPasswordFormGroup.value;

    if (password !== confirmPassword) {
      this.setPasswordFormGroup
        .get('password')
        ?.setErrors({ confirmPassword: true });
      this.setPasswordFormGroup
        .get('confirmPassword')
        ?.setErrors({ confirmPassword: true });
      return;
    }

    const userId = this._activatedRoute.snapshot.queryParamMap.get('userId');
    const resetCode =
      this._activatedRoute.snapshot.queryParamMap.get('resetCode');

    await this._authService.setPasswordAsync(userId!, resetCode!, password!);
  }
}
