import { Component, Input, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.css']
})
export class FavoriteListComponent implements OnInit {
  @Input('item') public item: any;

  public constructor(private mainService: MainService) {
  }

  public onClickLike(): void {
  }

  public ngOnInit() {
  }
}
