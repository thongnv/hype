import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurateComponent } from './curate.component';
import { CurateNewComponent } from './curate-new/curate-new.component';

const routes: Routes = [
  {path: '', component: CurateComponent},
  {path: 'new', component: CurateNewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurateRoutingModule { }
