import {PublicProfileComponent} from "./public-profile/public-profile.component";
import {EditProfileComponent} from "./edit-profile/edit-profile.component";

export const routes = [
  { path: '', component: PublicProfileComponent,  pathMatch: 'full' },
  { path: 'edit', component: EditProfileComponent }
];
