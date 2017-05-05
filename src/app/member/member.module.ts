import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routes } from './member-routing.module';
import { InterestComponent } from './interest/interest.component';
import { MemberComponent } from './member.component';
import { MemberNavigationComponent } from './member-navigation/member-navigation.component';
import { FollowingComponent } from './following/following.component';
import { FollowerComponent } from './follower/follower.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfilePublicComponent } from './profile-public/profile-public.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    InterestComponent,
    MemberComponent,
    MemberNavigationComponent,
    FollowingComponent,
    FollowerComponent,
    ProfileEditComponent,
    ProfilePublicComponent
  ]
})
export class MemberModule {
  public static routes = routes;
}
