import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";

import { routes } from './favorite-routing.module';
import { EventComponent } from './event/event.component';
import { ListComponent } from './list/list.component';
import { PlaceComponent } from './place/place.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EventComponent, ListComponent, PlaceComponent]
})
export class FavoriteModule {
  public static routes = routes;
}
