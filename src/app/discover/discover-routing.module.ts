import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EatComponent } from './discover-eat/eat.component';
import { PlayComponent } from './discover-play/play.component';

const routes: Routes = [
  {path: 'eat', component: EatComponent},
  {path: 'play', component: PlayComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscoverRoutingModule {
}
