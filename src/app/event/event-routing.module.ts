import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventDetailComponent } from './detail/detail.component';

const routes: Routes = [
  {path: ':slug', component: EventDetailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule { }
