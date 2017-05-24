import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';
import { DiscoverComponent } from './discover/discover.component';
import { CurateComponent } from './curate/curate.component';
import { EventDetailComponent } from './event/detail/detail.component';
import { CurateNewComponent } from './curate-new/curate-new.component';

export const ROUTES: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',  component: HomeComponent },
  { path: 'detail', loadChildren: './+detail#DetailModule'},
  { path: 'member', loadChildren: './member#MemberModule'},
  { path: 'discover',    component: DiscoverComponent },
  { path: 'curate',    component: CurateComponent },
  { path: 'curate/new',    component: CurateNewComponent},
  { path: 'event/:id',    component: EventDetailComponent },
  { path: 'auth',    loadChildren: './auth#AuthModule' },
  { path: '**',    component: NoContentComponent },
];
