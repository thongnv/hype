import { NgModule } from '@angular/core';

import { routes } from './member-routing.module';
import { MainService } from '../services/main.service';

@NgModule({
  imports: [
  ],
  declarations: [
  ],
  providers: [MainService]
})
export class MemberModule {
  public static routes = routes;
}
