import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurateDetailComponent } from './curate-detail/curate-detail.component';
import { EditArticleComponent } from './edit-article/edit-article.component';

const routes: Routes = [
  {path: ':slug', component: CurateDetailComponent},
  {path: ':slug/edit', component: EditArticleComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
