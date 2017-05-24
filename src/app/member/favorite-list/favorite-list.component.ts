import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.css']
})
export class FavoriteListComponent implements OnInit {
  @Input('item') public item: any;
  @Output('onClickDelete') public onClickDelete = new EventEmitter<any>();

  public constructor() {
  }

  public onDeleteEmit(item: any): void {
    this.onClickDelete.emit(item);
  }

  public ngOnInit() {
  }
}
