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
import { ModeComponent } from './mode-play/mode.component';
import { FollowingComponent } from './member/following/following.component';
import { MemberComponent } from './member/member.component';
import { InterestComponent } from './member/interest/interest.component';
import { ProfileEditComponent } from './member/profile-edit/profile-edit.component';
import { FollowerComponent } from './member/follower/follower.component';
import { FavoriteComponent } from './member/favorite/favorite.component';
import { ProfilePublicComponent } from './member/profile-public/profile-public.component';

export const ROUTES: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'discover', component: DiscoverComponent},
  {path: 'curate', component: CurateComponent},
  {path: 'article/:slug', component: CurateDetailComponent},
  {path: 'curate/new', component: CurateNewComponent},
  {path: 'share-event', component: ShareEventComponent},
  {path: 'event/:slug', component: EventDetailComponent},
  {path: 'company/:slug', component: CompanyDetailComponent},
  {path: 'auth', loadChildren: './auth#AuthModule'},
  {path: 'mode/play', component: ModeComponent},
  {path: 'member/following', component: FollowingComponent},
  {path: 'member/setting', component: MemberComponent},
  {path: 'member/interest', component: InterestComponent},
  {path: 'member/profile-edit', component: ProfileEditComponent},
  {path: 'member/following', component: FollowingComponent},
  {path: 'member/follower', component: FollowerComponent},
  {path: 'member/favorite', component: FavoriteComponent},
  {path: 'member/:slug', component: ProfilePublicComponent},
  {path: '**', component: NoContentComponent},

];
