import { InterestComponent } from './interest/interest.component';
import { MemberComponent } from './member.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfilePublicComponent } from './profile-public/profile-public.component';
import { FollowingComponent } from './following/following.component';
import { FollowerComponent } from './follower/follower.component';
import { FavoriteComponent } from './favorite/favorite.component';

export const routes = [
  {
    path: '', children: [
    {path: 'setting', component: MemberComponent},
    {path: 'interest', component: InterestComponent},
    {path: 'profile-edit', component: ProfileEditComponent},
    {path: 'following', component: FollowingComponent},
    {path: 'follower', component: FollowerComponent},
    {path: 'favorite', component: FavoriteComponent},
    {path: 'profiles', component: ProfilePublicComponent},
  ]
  }
];

