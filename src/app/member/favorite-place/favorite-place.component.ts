import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-favorite-place',
  templateUrl: './favorite-place.component.html',
  styleUrls: ['./favorite-place.component.css']
})
export class FavoritePlaceComponent {
  @Input('item') public item: any;
  @Input('canDelete') public canDelete: boolean;

  @Output('onClickDelete') public onClickDelete = new EventEmitter<any>();
  @Output('onClickVote') public onClickVote = new EventEmitter<any>();

  public onDeleteEmit(item: any): void {
    this.onClickDelete.emit(item);
  }

  public onVoteEvent(): void {
    this.onClickVote.emit();
  }
}
