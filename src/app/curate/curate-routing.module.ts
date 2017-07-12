import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurateComponent } from './curate.component';
import { CurateNewComponent } from './curate-new/curate-new.component';
import {CurateEditComponent} from "./curate-edit/curate-edit.component";

const routes: Routes = [
  {path: '', component: CurateComponent},
  {path: 'new', component: CurateNewComponent},
  {path: 'edit/:slug', component: CurateEditComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurateRoutingModule { }
