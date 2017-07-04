import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-boostrap-alert',
  templateUrl: './boostrap-alert.component.html',
  styleUrls: ['./boostrap-alert.component.css']
})
export class BootstrapAlertComponent {
  @Input('type') public type: string;
  @Input('content') public content: string;
}
