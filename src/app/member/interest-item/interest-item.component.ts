import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-interest-item',
  templateUrl: './interest-item.component.html',
  styleUrls: ['./interest-item.component.css']
})
export class InterestItemComponent implements OnInit {
  @Input('item') public item: any;
  constructor() { }

  onSelect(item: any):void{
    item.selected = (item.selected)? 0 : 1;
  }
  ngOnInit() {
    this.item.selected = 0;
  }

}
