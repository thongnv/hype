import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';
import { DiscoverComponent } from './discover/discover.component';
import { CurateComponent } from './curate/curate.component';
import { EventDetailComponent } from './event/detail/detail.component';
import { CurateNewComponent } from './curate-new/curate-new.component';
import { ShareEventComponent } from './event/share-event/share-event.component';
import { CuratePreviewComponent } from './curate-preview/curate-preview.component';
import { CurateDetailComponent } from './curate-detail/curate-detail.component';
import { CompanyDetailComponent } from './company/company-detail/company-detail.component';
import {ModeComponent} from "./mode-play/mode.component";

export const ROUTES: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',  component: HomeComponent },
  { path: 'detail', loadChildren: './+detail#DetailModule'},
  { path: 'member', loadChildren: './member#MemberModule'},
  { path: 'discover',    component: DiscoverComponent },
  { path: 'curate',    component: CurateComponent },
  { path: 'curate-detail/:id',    component: CurateDetailComponent },
  { path: 'curate/new',    component: CurateNewComponent},
  { path: 'share-event',    component: ShareEventComponent},
  { path: 'event/:id',    component: EventDetailComponent },
  { path: 'company/:id',    component: CompanyDetailComponent },
  { path: 'auth',    loadChildren: './auth#AuthModule' },
  { path: 'mode/play',    component: ModeComponent },
  { path: '**',    component: NoContentComponent },
];
