import {
  Component,
  OnInit
} from '@angular/core';
import { MainService } from '../services/main.service';
import { EventType } from '../app.interface';

const MARKER_ICON = '/assets/icon/icon_pointer.png';
const MARKER_ICON_SELECTED = '/assets/icon/icon_pointer_selected.png';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: ['./home.component.css'],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  // Set our default values
  public localState = {value: ''};
  public eventType: EventType[] = [];
  public selectedEventType: EventType;
  public eventFilter: any[] = [];
  public selectedEventFilter: any;
  public eventOrder: any[] = [];
  public selectedEventOrder: any;
  public events: any[] = [];
  public lists: any[] = [];
  public markers: any[] = [];
  public lat: number = 1.290270;
  public lng: number = 103.851959;
  public zoom: number = 11;

  private userProfile: any;

  // TypeScript public modifiers
  constructor(private mainService: MainService) {
    this.eventFilter = [
      {name: 'all'},
      {name: 'today'},
      {name: 'tomorrow'},
      {name: 'weekend'},
    ];
    this.eventOrder = [
      {name: 'top 100'},
      {name: 'latest'},
    ];
  }

  public ngOnInit() {
    // this.title.getData().subscribe(data => this.data = data);
    // this.getLoginStatus();
    // this.getUserProfile();
    this.getTrending();
    this.selectedEventOrder = this.eventOrder[0];
    this.selectedEventFilter = this.eventFilter[0];
  }

  public onSelectEventType(id: number): void {
    this.eventType[id].selected = !this.eventType[id].selected;
    if (this.eventType[id].selected && this.eventType[id].name.toLowerCase() === 'all') {
      this.eventType.forEach((event, index) => {
        this.eventType[index].selected = false;
      });
      this.eventType[id].selected = true;
    } else {
      this.eventType.forEach((event, index) => {
        if (this.eventType[index].name.toLowerCase() === 'all') {
          this.eventType[index].selected = false;
        }
      });
    }
  }

  public onClearForm(): void {
    this.selectedEventOrder = this.eventOrder[0];
    this.selectedEventFilter = this.eventFilter[0];
    this.eventType.forEach((event, index) => {
      if (this.eventType[index].name.toLowerCase() === 'all') {
        this.eventType[index].selected = true;
      } else {
        this.eventType[index].selected = false;
      }
    });
  }

  public onSelectEventFilter(filter: any): void {
    this.selectedEventFilter = filter;
  }

  public onSelectEventOrder(order: any): void {
    this.selectedEventOrder = order;
  }

  public onClickLike(item: any) {
    item.selected = !item.selected;
    console.log('LIKE: ', item);
  }

  public markerClick(id: any) {
    console.log('index: ', id);
    this.markers.forEach((marker) => {
      if (marker.parent === id) {
        marker.isOpen = true;
        marker.icon = MARKER_ICON_SELECTED;
      } else {
        if (marker.isOpen === true) {
          marker.isOpen = false;
        }
        if (marker.icon === MARKER_ICON_SELECTED) {
          marker.icon = MARKER_ICON;
        }
      }
    });
  }

  private getLoginStatus(): any {
    this.mainService.isLoggedIn();
  }

  private getUserProfile() {
    this.userProfile = this.mainService.getUserProfile();
  }

  private getTrending() {
    this.mainService.getUserPublicProfile().then((resp) => {
      this.eventType = resp.trending.event_type;
      resp.trending.event_type[0].selected = true;
      this.events = resp.favorite;
      this.lists = resp.curate_list;
      this.events.forEach((item) => {
        this.markers.push({
          lat: item.location.lat,
          lng: item.location.lng,
          infoTitle: item.title,
          image: item.image,
          parent: 'event_' + item.id,
          isOpen: false,
          price: item.price,
          icon: MARKER_ICON,
          openInfoWindow: true
        });
      });
      this.lists.forEach((item) => {
        // if (item.listPlaces.length) {
        //   item.listPlaces.forEach((place) => {
        //     this.markers.push({
        //       lat: item.info.location.lat,
        //       lng: item.info.location.lng,
        //       opacity: 0.4,
        //       infoTitle: item.info.,
        //       image: item.image,
        //       parent: 'list_' + item.id
        //     });
        //   });
        // }
        if (item.info.location) {
          this.markers.push({
            lat: item.info.location.lat,
            lng: item.info.location.lng,
            infoTitle: item.info.listName,
            image: item.images[0],
            parent: 'list_' + item.id,
            isOpen: false,
            icon: MARKER_ICON,
            openInfoWindow: true
          });
        }
      });
      this.markerClick(this.markers[0].parent);
    });
  }
}
