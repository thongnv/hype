import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruncateModule } from 'ng2-truncate';
import { MomentModule } from 'angular2-moment';
import { RatingModule } from 'ng2-rating';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { HelperModule } from '../helper/helper.module';

import { CompanyRoutingModule } from './company-routing.module';

import { CompanyService } from '../services/company.service';

import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { ReviewComponent } from './company-detail/review.component';
import { WriteReviewComponent } from './write-review/write-review.component';

@NgModule({
  imports: [
    CommonModule,
    TruncateModule,
    MomentModule,
    RatingModule,
    HelperModule,
    CompanyRoutingModule,
  ],
  declarations: [
    CompanyDetailComponent,
    WriteReviewComponent,
    ReviewComponent,
  ],
  providers: [
    CompanyService,
    NgbRatingConfig
  ],
})
export class CompanyModule {
}
