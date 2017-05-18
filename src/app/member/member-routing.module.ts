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
        {path: '', component: MemberComponent},
        {path: 'setting', component: MemberComponent},
        {path: 'interest', component: InterestComponent},
        {path: 'profile-edit', component: ProfileEditComponent},
        {path: 'profile', component: ProfilePublicComponent},
        {path: 'following', component: FollowingComponent},
        {path: 'follower', component: FollowerComponent},
        {path: 'favorite', component: FavoriteComponent},
    ]
    }
];

