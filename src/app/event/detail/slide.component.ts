import { Component, OnInit, OnDestroy, Input, HostBinding } from '@angular/core';

import { CarouselComponent, Direction } from  './carousel.component';

@Component({
  selector: 'slide',
  template: `
    <div [class.active]="active" class="item text-center">
      <ng-content></ng-content>
    </div>
  `
})
export class SlideComponent implements OnInit, OnDestroy {
  @Input() public index: number;
  @Input() public direction: Direction;

  @HostBinding('class.active')
  @Input() public active: boolean;

  @HostBinding('class.item')
  @HostBinding('class.carousel-item')
  public addClass: boolean = true;

  public image: string;

  constructor(private carousel: CarouselComponent) {
  }

  public ngOnInit() {
    this.carousel.addSlide(this);
  }

  public ngOnDestroy() {
    this.carousel.removeSlide(this);
  }
}
