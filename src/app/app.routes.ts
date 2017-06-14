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
import { AuthComponent } from './auth/auth.component';
import { LogoutComponent } from './auth/logout/logout.component';

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
  {path: 'mode/play', component: ModeComponent},
  {path: 'login', component: AuthComponent},
  {path: 'logout', component: LogoutComponent},
  {path: ':slug', component: ProfilePublicComponent},
  {path: ':slug/following', component: FollowingComponent},
  {path: ':slug/follower', component: FollowerComponent},
  {path: ':slug/setting', component: MemberComponent},
  {path: ':slug/interest', component: InterestComponent},
  {path: ':slug/profile-edit', component: ProfileEditComponent},
  {path: ':slug/favorite', component: FavoriteComponent},
  {path: '**', component: NoContentComponent},

];
