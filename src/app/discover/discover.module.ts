import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import {HelperModule} from '../helper/helper.module';
import { DiscoverRoutingModule } from './discover-routing.module';

import { ModeComponent } from './mode-play/mode.component';

@NgModule({
  imports: [
    CommonModule,

    HelperModule,
    DiscoverRoutingModule
  ],
  declarations: [
    ModeComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class DiscoverModule { }
