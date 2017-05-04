import {InterestComponent} from "./interest/interest.component";
import {MemberComponent} from "./member.component";

export const routes = [
  {
    path: '', children:[
      { path: '', component: MemberComponent },
      { path: 'setting', component: MemberComponent },
      { path: 'interest', component: InterestComponent },
      { path: 'profile', loadChildren: './profile#ProfileModule' },
      { path: 'follow', loadChildren: './follow#FollowModule' },
      { path: 'favorite', loadChildren: './favorite#FavoriteModule' }
    ]
  }
];

