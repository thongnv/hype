import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TruncateModule } from 'ng2-truncate';
import { MomentModule } from 'angular2-moment';
import { RatingModule } from 'ngx-rating';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from 'angular2-google-maps/core';

import { HelperModule } from '../helper/helper.module';
import { SlimScrollModule } from '../slim-scroll/slim-scroll.module';
import { CompanyRoutingModule } from './company-routing.module';

import { CompanyService } from '../services/company.service';

import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { ReviewComponent } from './company-detail/review.component';
import { WriteReviewComponent } from './write-review/write-review.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    TruncateModule,
    MomentModule,
    RatingModule,
    NgbModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAkysiDbFxbIPSuVN4XM4R2YpbGUNzk0CY',
      libraries: ['places', 'geometry']
    }),

    HelperModule,
    SlimScrollModule,
    CompanyRoutingModule,
  ],
  declarations: [
    CompanyDetailComponent,
    WriteReviewComponent,
    ReviewComponent,
  ],
  providers: [
    NgbRatingConfig,

    CompanyService,
  ],
})
export class CompanyModule {
}
