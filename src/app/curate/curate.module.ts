import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TruncateModule } from 'ng2-truncate';
import { MomentModule } from 'angular2-moment';
import { TinymceModule } from 'angular2-tinymce';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { AgmCoreModule } from 'angular2-google-maps/core';

import {HelperModule} from '../helper/helper.module';
import { HtmlToTextModule } from '../html-to-text/html-to-text.module';
import { CurateRoutingModule } from './curate-routing.module';

import { CurateComponent } from './curate.component';
import { CurateNewComponent } from './curate-new/curate-new.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    TruncateModule,
    MomentModule,
    TinymceModule.withConfig({}),
    ReCaptchaModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAkysiDbFxbIPSuVN4XM4R2YpbGUNzk0CY',
      libraries: ['places', 'geometry']
    }),

    HelperModule,
    HtmlToTextModule,
    CurateRoutingModule
  ],
  declarations: [
    CurateComponent,
    CurateNewComponent
  ],
  providers: [

  ],
})
export class CurateModule { }
