import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import {RatingModule} from "ng2-rating";
import { AgmCoreModule, GoogleMapsAPIWrapper } from 'angular2-google-maps/core';

import {HelperModule} from '../helper/helper.module';
import { EventRoutingModule } from './event-routing.module';

import { EventDetailComponent } from './detail/detail.component';
import {ExperienceComponent} from './detail/experience.component';
import {CarouselComponent} from './detail/carousel.component';
import {SlideComponent} from './detail/slide.component';
import {CommentComponent} from './detail/comment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    NgbModule.forRoot(),
    RatingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAkysiDbFxbIPSuVN4XM4R2YpbGUNzk0CY',
      libraries: ['places', 'geometry']
    }),


    HelperModule,
    EventRoutingModule
  ],
  exports: [
    CarouselComponent,
    SlideComponent
  ],
  declarations: [
    EventDetailComponent,
    ExperienceComponent,
    CarouselComponent,
    SlideComponent,
    CommentComponent
  ],
  providers: [NgbRatingConfig, GoogleMapsAPIWrapper],
})
export class EventModule { }
