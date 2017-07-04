import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { TruncateModule } from 'ng2-truncate';
import { ImageModal } from 'angular2-image-popup/directives/angular2-image-popup/image-modal-popup';
import { SlimScroll } from 'angular-io-slimscroll';

import { HtmlToTextModule } from '../html-to-text/html-to-text.module';

// services
import { SmallLoaderService } from './small-loader/small-loader.service';

import { BoostrapAlertComponent } from './boostrap-alert/boostrap-alert.component';

@NgModule({
  imports: [
    CommonModule,

    TruncateModule,
    HtmlToTextModule
  ],
  exports: [
    TruncateModule,

    BoostrapAlertComponent
  ],
  declarations: [
    BoostrapAlertComponent,
    ImageModal,
    SlimScroll,
  ],
  providers: [
    SmallLoaderService
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HelperModule {
}
