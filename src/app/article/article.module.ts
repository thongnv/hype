import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgmCoreModule, GoogleMapsAPIWrapper } from 'angular2-google-maps/core';

import {HelperModule} from '../helper/helper.module';
import {SlimScrollModule} from '../slim-scroll/slim-scroll.module';
import { ArticleRoutingModule } from './article-routing.module';

import { CurateDetailComponent } from './curate-detail/curate-detail.component';

@NgModule({
  imports: [
    CommonModule,

    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAkysiDbFxbIPSuVN4XM4R2YpbGUNzk0CY',
      libraries: ['places', 'geometry']
    }),

    HelperModule,
    SlimScrollModule,
    ArticleRoutingModule
  ],
  declarations: [
    CurateDetailComponent
  ],
  providers: [GoogleMapsAPIWrapper]
})
export class ArticleModule { }
