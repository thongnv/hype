import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {CarouselComponent} from '../event/detail/carousel.component';
import {SlideComponent} from '../event/detail/slide.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [CarouselComponent, SlideComponent],
  declarations: [CarouselComponent, SlideComponent]
})
export class CarouseModule { }
