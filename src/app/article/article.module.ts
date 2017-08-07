import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgmCoreModule } from 'angular2-google-maps/core';

import { HelperModule } from '../helper/helper.module';
import { SlimScrollModule } from '../slim-scroll/slim-scroll.module';
import { ArticleRoutingModule } from './article-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TruncateModule } from 'ng2-truncate';
import { MomentModule } from 'angular2-moment';
import { TinymceModule } from 'angular2-tinymce';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { TagInputModule } from 'ngx-chips';

import { HtmlToTextModule } from '../html-to-text/html-to-text.module';

import { CurateDetailComponent } from './curate-detail/curate-detail.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TruncateModule,
    MomentModule,
    TinymceModule.withConfig({auto_focus: false}),
    ReCaptchaModule,
    TagInputModule,
    HtmlToTextModule,
    CommonModule,
    AgmCoreModule,
    HelperModule,
    SlimScrollModule,
    ArticleRoutingModule
  ],
  declarations: [
    CurateDetailComponent,
    ArticleEditComponent
  ],
  providers: []})
export class ArticleModule {
}
