import {FollowingComponent} from "./following/following.component";
import {FollowerComponent} from "./follower/follower.component";

export const routes = [
  {path : '', component: FollowingComponent, pathMatch: 'full'},
  {path : 'following', component: FollowingComponent},
  {path : 'follower', component: FollowerComponent}
];

