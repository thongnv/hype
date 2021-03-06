import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-favorite-event',
  templateUrl: './favorite-event.component.html',
  styleUrls: ['./favorite-event.component.css']
})
export class FavoriteEventComponent {
  @Input('item') public item: any;
  @Input('isCurrentUser') public isCurrentUser: boolean;

  @Output('onClickLike') public onClickLike = new EventEmitter<any>();
  @Output('onClickDelete') public onClickDelete = new EventEmitter<any>();
  @Output('onClickVote') public onClickVote = new EventEmitter<any>();

  public onDeleteEmit(item: any): void {
    this.onClickDelete.emit(item);
  }
  public onVoteEvent(item: number): void {
    this.onClickVote.emit(item);
  }
}
