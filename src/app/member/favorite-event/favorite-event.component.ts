import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-favorite-event',
  templateUrl: './favorite-event.component.html',
  styleUrls: ['./favorite-event.component.css']
})
export class FavoriteEventComponent {
  @Input('item') public item: any;
  @Input('canDelete') public canDelete: boolean;

  @Output('onClickLike') public onClickLike = new EventEmitter<any>();
  @Output('onClickDelete') public onClickDelete = new EventEmitter<any>();

  public onLikeEmit(item: any) {
    item.selected = item.selected ? false : true;
    this.onClickLike.emit(item);
  }
  public onDeleteEmit(item: any): void {
    this.onClickDelete.emit(item);
  }
}
