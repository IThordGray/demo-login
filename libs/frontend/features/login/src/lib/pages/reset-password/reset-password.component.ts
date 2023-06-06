import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'lib-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);

  readonly resetPasswordFormGroup = new FormGroup({
    email: new FormControl<string>('', Validators.required),
  });

  async resetPasswordAsync(): Promise<void> {
    this.resetPasswordFormGroup.markAllAsTouched();
    if (this.resetPasswordFormGroup.invalid) return;

    const { email } = this.resetPasswordFormGroup.value;

    await this._authService.resetPasswordAsync(email!);
    await this._router.navigate(['../reset-password-sent'], {
      relativeTo: this._activatedRoute,
    });
  }
}
