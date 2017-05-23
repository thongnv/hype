import { Component, Input, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { AppState } from '../../app.service';

@Component({
  selector: 'app-favorite-place',
  templateUrl: './favorite-place.component.html',
  styleUrls: ['./favorite-place.component.css']
})
export class FavoritePlaceComponent implements OnInit {
  @Input('item') public item: any;

  public constructor(private mainService: MainService) {
  }

  public onClickLike(): void {
  }

  public ngOnInit() {
  }

}
