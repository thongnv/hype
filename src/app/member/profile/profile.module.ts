import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { routes } from './profile-routing.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { PublicProfileComponent } from './public-profile/public-profile.component';
import { AppState } from '../../app.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    EditProfileComponent,
    PublicProfileComponent
  ],
  providers: [AppState]
})
export class ProfileModule {
  public static routes = routes;
}
