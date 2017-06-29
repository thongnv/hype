import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';
import { ServerErrorComponent } from './server-error/server-error.component';
import { CurateComponent } from './curate/curate.component';
import { CurateNewComponent } from './curate-new/curate-new.component';
import { ShareEventComponent } from './event/share-event/share-event.component';
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

  // {path: 'home', component: HomeComponent},
  {path: 'home', loadChildren: 'app/home/home.module#HomeModule'},

  {path: '404', component: NoContentComponent},
  {path: '500', component: ServerErrorComponent},
  {path: 'curate', component: CurateComponent},
  {path: 'article/:slug', component: CurateDetailComponent},
  {path: 'curate/new', component: CurateNewComponent},
  {path: 'share-event', component: ShareEventComponent},

  // {path: 'event/:slug', component: EventDetailComponent},
  {path: 'event/:slug', loadChildren: 'app/event/event.module#EventModule'},

  {path: 'company/:slug', component: CompanyDetailComponent},
  {path: 'discover', component: ModeComponent},
  {path: 'discover/:location', component: ModeComponent},
  {path: 'login', component: AuthComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'member/favorite', component: FavoriteComponent},
  {path: ':slug', component: ProfilePublicComponent},
  {path: ':slug/following', component: FollowingComponent},
  {path: ':slug/follower', component: FollowerComponent},
  {path: ':slug/setting', component: MemberComponent},
  {path: ':slug/interest', component: InterestComponent},
  {path: ':slug/profile-edit', component: ProfileEditComponent},
  {path: ':slug/favorite', component: FavoriteComponent},
  {path: '**', component: NoContentComponent},
];
