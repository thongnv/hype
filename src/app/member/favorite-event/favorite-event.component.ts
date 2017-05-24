import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-favorite-event',
  templateUrl: './favorite-event.component.html',
  styleUrls: ['./favorite-event.component.css']
})
export class FavoriteEventComponent implements OnInit {
  @Input('item') public item: any;

  @Output('onClickLike') public onClickLike = new EventEmitter<any>();
  @Output('onClickDelete') public onClickDelete = new EventEmitter<any>();

  public constructor() {
  }
  public onLikeEmit(item: any) {
    item.selected = item.selected ? false : true;
    this.onClickLike.emit(item);
  }
  public onDeleteEmit(item: any): void {
    this.onClickDelete.emit(item);
  }
  public ngOnInit() {
  }
}
