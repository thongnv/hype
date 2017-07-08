import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class EventItemComponent {

  @Input('events') public events: any;
  @Output('onClickLike') public onClickLike = new EventEmitter<any>();

  public onLikeEmit(item: any) {
    this.onClickLike.emit(item);
  }

}
