import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { routes } from './follow-routing.module';
import { FollowingComponent } from './following/following.component';
import { FollowerComponent } from './follower/follower.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FollowingComponent, FollowerComponent]
})
export class FollowModule {
  public static routes = routes;
}
