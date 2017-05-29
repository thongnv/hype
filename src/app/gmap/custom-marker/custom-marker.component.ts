import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-marker',
  templateUrl: './custom-marker.component.html',
  styleUrls: ['./custom-marker.component.css']
})
export class CustomMarkerComponent {
  @Input('marker') public marker: any;
  @Input('index') public index: any;
  @Output('onClick') public onClick = new EventEmitter<any>();

  public markerClick() {
    this.onClick.emit(this.index);
  }
}
