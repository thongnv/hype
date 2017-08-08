import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { RatingModule } from 'ng2-rating';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { MomentModule } from 'angular2-moment';

import { HelperModule } from '../helper/helper.module';
import { CarouseModule } from '../carouse/carouse.module';
import { EventRoutingModule } from './event-routing.module';

import { EventDetailComponent } from './detail/detail.component';
import { ExperienceComponent } from './detail/experience.component';
import { CommentComponent } from './detail/comment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    RatingModule,
    AgmCoreModule,
    HelperModule,
    MomentModule,
    CarouseModule,
    EventRoutingModule
  ],
  declarations: [
    EventDetailComponent,
    ExperienceComponent,
    CommentComponent
  ],
  providers: [
    NgbRatingConfig,
  ],
})
export class EventModule {
}
