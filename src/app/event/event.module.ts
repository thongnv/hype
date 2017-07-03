import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventRoutingModule } from './event-routing.module';

import { EventDetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,

    EventDetailComponent,
    EventRoutingModule
  ],
  declarations: [
    EventDetailComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class EventModule { }
