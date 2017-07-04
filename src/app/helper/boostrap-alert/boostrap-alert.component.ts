import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-boostrap-alert',
  templateUrl: './boostrap-alert.component.html',
  styleUrls: ['./boostrap-alert.component.css']
})
export class BootstrapAlertComponent implements OnInit {
  @Input('type') public type: string;
  @Input('content') public content: string;
}
