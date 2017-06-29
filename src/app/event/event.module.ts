import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventRoutingModule } from './event-routing.module';

// components
import {EventDetailComponent} from './detail/detail.component';
import {CommentComponent} from './detail/comment.component';
import {ExperienceComponent} from './detail/experience.component';
import {CarouselComponent} from './detail/carousel.component';
import {SlideComponent} from './detail/slide.component';

@NgModule({
  imports: [
    CommonModule,
    EventRoutingModule
  ],
  declarations: [EventDetailComponent, CommentComponent, ExperienceComponent, CarouselComponent, SlideComponent]
})
export class EventModule { }
