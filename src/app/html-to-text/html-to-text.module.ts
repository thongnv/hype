import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Html2TextPipe } from '../shared/html-2-text.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [Html2TextPipe],
  declarations: [Html2TextPipe]
})
export class HtmlToTextModule { }
