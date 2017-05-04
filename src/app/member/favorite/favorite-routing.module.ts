import {EventComponent} from "./event/event.component";
import {ListComponent} from "./list/list.component";
import {PlaceComponent} from "./place/place.component";

export const routes = [
  {path: '', component: EventComponent, pathMatch:'full' },
  {path: 'event', component: EventComponent},
  {path: 'list', component: ListComponent},
  {path: 'place', component: PlaceComponent},
];
