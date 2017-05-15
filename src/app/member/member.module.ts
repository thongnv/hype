import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routes } from './member-routing.module';
import { InterestComponent } from './interest/interest.component';
import { MemberComponent } from './member.component';
import { MemberNavigationComponent } from './member-navigation/member-navigation.component';
import { FollowingComponent } from './following/following.component';
import { FollowerComponent } from './follower/follower.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfilePublicComponent } from './profile-public/profile-public.component';
import { CountryPickerModule } from 'angular2-countrypicker';
import { InterestItemComponent } from './interest-item/interest-item.component';
import { FollowItemComponent } from './follow-item/follow-item.component';
import {MainService} from "../services/main.service";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    CountryPickerModule.forRoot({
      baseUrl: 'assets/'
    }),
  ],
  declarations: [
    InterestComponent,
    MemberComponent,
    MemberNavigationComponent,
    FollowingComponent,
    FollowerComponent,
    ProfileEditComponent,
    ProfilePublicComponent,
    InterestItemComponent,
    FollowItemComponent

  ],
  providers: [MainService]
})
export class MemberModule {
  public static routes = routes;
}
