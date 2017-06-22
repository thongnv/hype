import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.css']
})
export class FavoriteListComponent {
  @Input('item') public item: any;
  @Input('canDelete') public canDelete: boolean;
  @Output('onClickDelete') public onClickDelete = new EventEmitter<any>();

  public onDeleteEmit(item: any): void {
    this.onClickDelete.emit(item);
  }
}
