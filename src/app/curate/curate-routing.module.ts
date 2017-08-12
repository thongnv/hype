import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurateComponent } from './curate.component';
import { CurateNewComponent } from './curate-new/curate-new.component';
import { CuratedCategoryComponent } from './curated-category/curated-category.component';
import { CuratedListComponent } from './curated-list/curated-list.component';

const routes: Routes = [
  {path: '', component: CuratedListComponent},
  {path: 'new', component: CurateNewComponent},
  {path: ':slug', component: CuratedCategoryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurateRoutingModule {
}
