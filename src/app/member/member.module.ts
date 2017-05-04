import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routes } from './member-routing.module';
import { InterestComponent } from './interest/interest.component';
import { MemberComponent } from './member.component';
import { MemberNavigationComponent } from './member-navigation/member-navigation.component';

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
    MemberNavigationComponent
  ]
})
export class MemberModule {
  public static routes = routes;
}
