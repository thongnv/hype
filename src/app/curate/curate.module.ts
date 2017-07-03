import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgmCoreModule, GoogleMapsAPIWrapper } from 'angular2-google-maps/core';

import {HelperModule} from '../helper/helper.module';
import { CurateRoutingModule } from './curate-routing.module';

import { CurateComponent } from './curate.component';
import { CurateNewComponent } from './curate-new/curate-new.component';

@NgModule({
  imports: [
    CommonModule,

    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAkysiDbFxbIPSuVN4XM4R2YpbGUNzk0CY',
      libraries: ['places', 'geometry']
    }),

    HelperModule,
    CurateRoutingModule
  ],
  declarations: [
    CurateComponent,
    CurateNewComponent
  ],
  providers: [
    GoogleMapsAPIWrapper
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class CurateModule { }
