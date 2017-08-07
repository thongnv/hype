import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurateDetailComponent } from './curate-detail/curate-detail.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';

const routes: Routes = [
  {path: ':slug', component: CurateDetailComponent},
  {path: ':slug/edit', component: ArticleEditComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
