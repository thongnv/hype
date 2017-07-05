import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlimScroll } from 'angular-io-slimscroll';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [SlimScroll],
  declarations: [SlimScroll]
})
export class SlimScrollModule { }
