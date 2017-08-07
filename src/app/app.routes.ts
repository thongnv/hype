import { Routes } from '@angular/router';

import { NoContentComponent } from './no-content';
import { ServerErrorComponent } from './server-error/server-error.component';

import { ShareEventComponent } from './event/share-event/share-event.component';
import { FollowingComponent } from './member/following/following.component';
import { MemberComponent } from './member/member.component';
import { InterestComponent } from './member/interest/interest.component';
import { ProfileEditComponent } from './member/profile-edit/profile-edit.component';
import { FollowerComponent } from './member/follower/follower.component';
import { FavoriteComponent } from './member/favorite/favorite.component';
import { ProfilePublicComponent } from './member/profile-public/profile-public.component';
import { AuthComponent } from './auth/auth.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { EditEventComponent } from './event/edit-event/edit-event.component';

export const ROUTES: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', loadChildren: 'app/home/home.module#HomeModule'},
  {path: 'curate', loadChildren: 'app/curate/curate.module#CurateModule'},
  {path: 'article', loadChildren: 'app/article/article.module#ArticleModule'},
  {path: 'company', loadChildren: 'app/company/company.module#CompanyModule'},
  {path: 'discover', loadChildren: 'app/discover/discover.module#DiscoverModule'},
  {path: 'event', loadChildren: 'app/event/event.module#EventModule'},
  {path: 'event/:slug/edit', component: EditEventComponent},
  {path: 'member/favorite', component: FavoriteComponent},
  {path: 'login', component: AuthComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'share-event', component: ShareEventComponent},
  {path: '404', component: NoContentComponent},
  {path: '500', component: ServerErrorComponent},
  {path: ':slug', component: ProfilePublicComponent},
  {path: ':slug/following', component: FollowingComponent},
  {path: ':slug/follower', component: FollowerComponent},
  {path: ':slug/setting', component: MemberComponent},
  {path: ':slug/interest', component: InterestComponent},
  {path: ':slug/profile-edit', component: ProfileEditComponent},
  {path: ':slug/favorite', component: FavoriteComponent},

  {path: '**', component: NoContentComponent},
];
