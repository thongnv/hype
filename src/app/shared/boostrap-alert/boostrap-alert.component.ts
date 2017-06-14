import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-boostrap-alert',
  templateUrl: './boostrap-alert.component.html',
  styleUrls: ['./boostrap-alert.component.css']
})
export class BoostrapAlertComponent implements OnInit {
  @Input('type') public type: string;
  @Input('content') public content: string;

  public classAlert: string = 'alert ';
  public headerContent;

  public ngOnInit() {
    this.classAlert += (this.type !== '') ? 'alert-' + this.type : 'alert-danger';
    switch (this.type.toLowerCase()) {
      case 'success':
        this.headerContent = 'Success';
        break;
      case 'info':
        this.headerContent = 'Information';
        break;
      case 'warning':
        this.headerContent = 'Warning';
        break;
      case 'danger':
        this.headerContent = 'Oops';
        break;
      default:
        this.headerContent = 'Oops';
    }
  }
}
