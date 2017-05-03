import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';
import { DiscoverComponent } from './discover/discover.component';
import { CurateComponent } from './curate/curate.component';
import { FavoriteComponent } from './favorite/favorite.component';

export const ROUTES: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',  component: HomeComponent },
  { path: 'detail', loadChildren: './+detail#DetailModule'},
  { path: 'discover',    component: DiscoverComponent },
  { path: 'curate',    component: CurateComponent },
  { path: 'favorite',    component: FavoriteComponent },
  { path: '**',    component: NoContentComponent },
];
