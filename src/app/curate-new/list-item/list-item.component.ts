import { Component, Input } from '@angular/core';
export interface ListItem {
  place?: string;
  description?: string;
  image?: string;
}

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent {
  @Input() public item: ListItem;
  @Input() public index: number;
}
