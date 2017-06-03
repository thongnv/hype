import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.css']
})
export class EventItemComponent {

  @Input('item') public item: any;

  @Output('onClickLike') public onClickLike = new EventEmitter<any>();

  public onLikeEmit(item: any) {
    this.onClickLike.emit(item);
  }
}
