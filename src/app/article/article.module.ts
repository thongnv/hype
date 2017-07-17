import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgmCoreModule } from 'angular2-google-maps/core';

import {HelperModule} from '../helper/helper.module';
import {SlimScrollModule} from '../slim-scroll/slim-scroll.module';
import { ArticleRoutingModule } from './article-routing.module';

import { CurateDetailComponent } from './curate-detail/curate-detail.component';

@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule,
    HelperModule,
    SlimScrollModule,
    ArticleRoutingModule
  ],
  declarations: [
    CurateDetailComponent
  ],
  providers: [

  ]
})
export class ArticleModule { }
