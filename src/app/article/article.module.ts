import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import {HelperModule} from '../helper/helper.module';
import { ArticleRoutingModule } from './article-routing.module';

import { CurateDetailComponent } from './curate-detail/curate-detail.component';

@NgModule({
  imports: [
    CommonModule,

    HelperModule,
    ArticleRoutingModule
  ],
  declarations: [
    CurateDetailComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ArticleModule { }
