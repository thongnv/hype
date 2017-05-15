import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { FacebookModule } from 'ngx-facebook';

import { routes } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LogoutComponent } from './logout/logout.component';
import { MainService } from "../services/main.service";
import { LocalStorageModule } from "angular-2-local-storage";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpModule,
    FacebookModule.forRoot(),
    LocalStorageModule.withConfig({
      prefix: 'hylo-app',
      storageType: 'localStorage'
    })
  ],
  declarations: [
    AuthComponent,
    LogoutComponent
  ],
  providers: [MainService]
})
export class AuthModule {
  public static routes = routes;
}
