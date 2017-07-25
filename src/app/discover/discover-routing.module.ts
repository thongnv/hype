import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModeComponent } from './mode-play/mode.component';
import {EatComponent} from "./discover-eat/eat.component";
import {PlayComponent} from "./discover-play/play.component";

const routes: Routes = [
  {path: 'eat', component: EatComponent},
  {path: 'eat/:location', component: EatComponent},
  {path: 'play', component: PlayComponent},
  {path: 'play/:location', component: PlayComponent},
  {path: ':location', component: ModeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscoverRoutingModule { }
