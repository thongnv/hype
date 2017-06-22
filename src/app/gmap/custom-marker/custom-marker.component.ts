import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-marker',
  templateUrl: './custom-marker.component.html',
  styleUrls: ['./custom-marker.component.css']
})
export class CustomMarkerComponent implements OnInit {
  @Input('marker') public marker: any;
  @Input('index') public index: any;
  @Input('hasLabel') public hasLabel: boolean;
  @Output('onClick') public onClick = new EventEmitter<any>();

  public label;

  public markerClick() {
    this.onClick.emit(this.index);
  }

  public ngOnInit() {
    this.label = this.hasLabel ? (this.index + 1).toString() : '';
  }
}
