import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// modules
import { TruncateModule } from 'ng2-truncate';
import { ImageModal } from 'angular2-image-popup/directives/angular2-image-popup/image-modal-popup';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { TinymceModule } from 'angular2-tinymce';
import { MomentModule } from 'angular2-moment';

import { SlimScrollModule } from '../slim-scroll/slim-scroll.module';
import { HtmlToTextModule } from '../html-to-text/html-to-text.module';

import { CompanyService } from '../services/company.service';

// services
import { SmallLoaderService } from './small-loader/small-loader.service';

import { BoostrapAlertComponent } from './boostrap-alert/boostrap-alert.component';
import { BoostrapCarouselComponent } from './boostrap-carousel/boostrap-carousel.component';
import { SlideCarouselComponent } from './slide-carousel/slide-carousel.component';
import { SmallLoaderComponent } from './small-loader/small-loader.component';
import { GmapAutoPlaceComponent } from '../gmap/gmap-auto-place/gmap-auto-place.component';
import { CustomMarkerComponent } from '../gmap/custom-marker/custom-marker.component';
import { PlaceImageComponent } from './place-image/place-image.component';
import { GeocodeMarkerComponent } from '../gmap/gmap-geocode-marker/gmap-geocode-marker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule,
    TruncateModule,
    TinymceModule.withConfig({auto_focus: false}),
    MomentModule,

    HtmlToTextModule,
    SlimScrollModule
  ],
  exports: [
    TruncateModule,
    BoostrapAlertComponent,
    BoostrapCarouselComponent,
    SlideCarouselComponent,
    SmallLoaderComponent,
    GmapAutoPlaceComponent,
    CustomMarkerComponent,
    PlaceImageComponent,
    GeocodeMarkerComponent,

    ImageModal
  ],
  declarations: [
    ImageModal,

    BoostrapAlertComponent,
    BoostrapCarouselComponent,
    SlideCarouselComponent,
    SmallLoaderComponent,
    GmapAutoPlaceComponent,
    CustomMarkerComponent,
    PlaceImageComponent,
    GeocodeMarkerComponent,

  ],
  providers: [
    SmallLoaderService,
    CompanyService
  ],
})
export class HelperModule {
}
