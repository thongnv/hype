import {Component, OnInit, OnDestroy, Input, HostBinding } from '@angular/core';
import {BoostrapCarouselComponent, Direction} from  '../boostrap-carousel/boostrap-carousel.component';

@Component({
  selector: 'app-slide-carousel',
  templateUrl: './slide-carousel.component.html',
  styleUrls: ['./slide-carousel.component.css']
})
export class SlideCarouselComponent implements OnInit {

  @Input() public index:number;
  @Input() public direction:Direction;

  @HostBinding('class.active')
  @Input() public active:boolean;

  @HostBinding('class.item')
  @HostBinding('class.carousel-item')
  private addClass:boolean = true;

  constructor(private carousel:BoostrapCarouselComponent) {
  }

  public ngOnInit() {
    this.carousel.addSlide(this);
  }

  public ngOnDestroy() {
    this.carousel.removeSlide(this);
  }

}
