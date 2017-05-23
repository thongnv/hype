import { Component, Input, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-favorite-event',
  templateUrl: './favorite-event.component.html',
  styleUrls: ['./favorite-event.component.css']
})
export class FavoriteEventComponent implements OnInit {
  @Input('item') public item: any;

  public constructor(private mainService: MainService) {
  }

  public onClickLike(): void {
  }

  public ngOnInit() {
    console.log(this.item);
  }

}
