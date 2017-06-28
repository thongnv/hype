import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import {EventDetailComponent} from './detail/detail.component';

const routes: Routes = [
  {path: '', redirectTo: '/event/:slug', pathMatch: 'full'},
  {path: 'event/:slug', component: EventDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule { }
