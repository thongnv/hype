import {AuthComponent} from "./auth.component";
import {LogoutComponent} from "./logout/logout.component";
export const routes = [
  {
    path: '', children:[
    { path: '', component: AuthComponent },
    { path: 'login', component: AuthComponent },
    { path: 'logout', component: LogoutComponent },
  ]
  }
];