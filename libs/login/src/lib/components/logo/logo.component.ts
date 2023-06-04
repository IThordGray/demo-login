import { Component, Input } from '@angular/core';

@Component({
  selector: 'itg-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent {
  @Input() inline: boolean = false;
}
