import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import {RatingModule} from "ng2-rating";
import { AgmCoreModule, GoogleMapsAPIWrapper } from 'angular2-google-maps/core';

import {HelperModule} from '../helper/helper.module';
import {CarouseModule} from '../carouse/carouse.module';
import { EventRoutingModule } from './event-routing.module';

import { EventDetailComponent } from './detail/detail.component';
import {ExperienceComponent} from './detail/experience.component';
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
    CarouseModule,
    EventRoutingModule
  ],
  declarations: [
    EventDetailComponent,
    ExperienceComponent,
    CommentComponent
  ],
  providers: [NgbRatingConfig, GoogleMapsAPIWrapper],
})
export class EventModule { }
