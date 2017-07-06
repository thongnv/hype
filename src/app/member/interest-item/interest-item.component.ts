import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-interest-item',
  templateUrl: './interest-item.component.html',
  styleUrls: ['./interest-item.component.css']
})
export class InterestItemComponent {
  @Input('item') public item: any;

  public onSelect(): void {
    this.item.bookmark = !this.item.bookmark;
  }
}
