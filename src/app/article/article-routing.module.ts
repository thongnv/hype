import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurateDetailComponent } from './curate-detail/curate-detail.component';

const routes: Routes = [
  {path: ':slug', component: CurateDetailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
