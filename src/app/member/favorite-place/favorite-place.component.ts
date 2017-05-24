import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-favorite-place',
  templateUrl: './favorite-place.component.html',
  styleUrls: ['./favorite-place.component.css']
})
export class FavoritePlaceComponent implements OnInit {
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
