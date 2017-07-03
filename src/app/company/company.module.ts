import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';

import { CompanyDetailComponent } from './company-detail/company-detail.component';

@NgModule({
  imports: [
    CommonModule,
    CompanyRoutingModule
  ],
  declarations: [
    CompanyDetailComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class CompanyModule { }
