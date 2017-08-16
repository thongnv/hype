import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NouisliderModule } from 'ng2-nouislider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { TreeviewModule } from 'ngx-treeview';

import { HtmlToTextModule } from '../html-to-text/html-to-text.module';
import { HelperModule } from '../helper/helper.module';
import { DiscoverRoutingModule } from './discover-routing.module';

import { EatComponent } from './discover-eat/eat.component';
import { PlayComponent } from './discover-play/play.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NouisliderModule,
    NgbModule.forRoot(),
    AgmCoreModule,
    TreeviewModule.forRoot(),

    HtmlToTextModule,
    HelperModule,
    DiscoverRoutingModule
  ],
  declarations: [
    EatComponent,
    PlayComponent
  ],
  providers: [],
})
export class DiscoverModule {
}
