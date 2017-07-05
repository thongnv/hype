import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModeComponent } from './mode-play/mode.component';

const routes: Routes = [
  {path: '', component: ModeComponent},
  {path: ':location', component: ModeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscoverRoutingModule { }
