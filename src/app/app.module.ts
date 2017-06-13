import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  NgModule, ApplicationRef
} from '@angular/core';
import {
  removeNgStyles, createNewHosts, createInputTransfer
} from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';

import { AgmCoreModule, GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { Ng2ScrollableModule } from 'ng2-scrollable';
import { TruncateModule } from 'ng2-truncate';
import { SlimScroll } from 'angular-io-slimscroll';
import { ImageModal } from 'angular2-image-popup/directives/angular2-image-popup/image-modal-popup';

import '../styles/styles.scss';
import '../styles/headings.css';
import { GmapComponent } from './gmap/gmap.component';
import { DiscoverComponent } from './discover/discover.component';
import { CurateComponent } from './curate/curate.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { TinymceModule } from 'angular2-tinymce';
import { CountryPickerModule } from 'angular2-countrypicker';
import { LocalStorageModule } from 'angular-2-local-storage';
import { ImageUploadModule } from 'ng2-imageupload';
import { NavbarComponent } from './navbar/navbar.component';
import { MainService } from './services/main.service';
import { GmapClustererDirective } from './gmap/custom-gmap.directive';
import { GmapService } from './services/gmap.service';
import { EventDetailComponent } from './event/detail/detail.component';
import { CurateNewComponent } from './curate-new/curate-new.component';
import { SlideComponent } from './event/detail/slide.component';
import { CarouselComponent } from './event/detail/carousel.component';
import { GmapAutoPlaceComponent } from './gmap/gmap-auto-place/gmap-auto-place.component';
import { ShareEventComponent } from './event/share-event/share-event.component';
import { EventService } from './services/event.service';
import { CompanyService } from './services/company.service';
import { MyArray } from './shared/num-to-array.pipe';
import { CustomMarkerComponent } from './gmap/custom-marker/custom-marker.component';
import { CurateDetailComponent } from './curate-detail/curate-detail.component';
import { CommentComponent } from './event/detail/comment.component';
import { ExperienceComponent } from './event/detail/experience.component';
import { Angular2FontawesomeModule } from 'angular2-fontawesome';
import { MomentModule } from 'angular2-moment';
import { CurateListPipe } from './shared/curate-list.pipe';
import { BoostrapCarouselComponent } from './boostrap-carousel/boostrap-carousel.component';
import { SlideCarouselComponent } from './slide-carousel/slide-carousel.component';
import { TripleSlidePipe } from './shared/triple-slide.pipe';
import { CompanyDetailComponent } from './company/company-detail/company-detail.component';
import { NouisliderModule } from 'ng2-nouislider';
import { ModeComponent } from './mode-play/mode.component';
import { BaseApiService } from './services/service_base.service';
import { ModeService } from './services/mode.service';
import { WriteReviewComponent } from './company/write-review/write-review.component';
import { EventItemComponent } from './event/event-item/event-item.component';
import { GeocodeMarkerComponent } from './gmap/gmap-geocode-marker/gmap-geocode-marker';
import { FollowingComponent } from './member/following/following.component';
import { MemberNavigationComponent } from './member/member-navigation/member-navigation.component';
import { FollowItemComponent } from './member/follow-item/follow-item.component';
import { BoostrapAlertComponent } from './member/boostrap-alert/boostrap-alert.component';
import { FavoritePipe } from './shared/favorite.pipe';
import { FavoriteEventComponent } from './member/favorite-event/favorite-event.component';
import { InterestComponent } from './member/interest/interest.component';
import { MemberComponent } from './member/member.component';
import { FollowerComponent } from './member/follower/follower.component';
import { ProfileEditComponent } from './member/profile-edit/profile-edit.component';
import { ProfilePublicComponent } from './member/profile-public/profile-public.component';
import { InterestItemComponent } from './member/interest-item/interest-item.component';
import { FavoriteComponent } from './member/favorite/favorite.component';
import { FavoriteListComponent } from './member/favorite-list/favorite-list.component';
import { FavoritePlaceComponent } from './member/favorite-place/favorite-place.component';
import { HomeService } from './services/home.service';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NotificationComponent } from './navbar/notification/notification.component';
import { StarVoteComponent } from './star-vote/star-vote.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { LoaderService } from './shared/loader/loader.service';
import { ReviewComponent } from './company/company-detail/review.component';
import { Html2TextPipe } from './shared/html-2-text.pipe';
import { InstagramImageComponent } from './shared/instagram-image/instagram-image.component';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState,
  MainService
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};
/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    HomeComponent,
    NoContentComponent,
    GmapComponent,
    DiscoverComponent,
    CurateComponent,
    NavbarComponent,
    GmapClustererDirective,
    EventDetailComponent,
    CurateNewComponent,
    SlideComponent,
    CarouselComponent,
    ShareEventComponent,
    GmapAutoPlaceComponent,
    CommentComponent,
    ExperienceComponent,
    ReviewComponent,
    MyArray,
    CustomMarkerComponent,
    CurateDetailComponent,
    CurateListPipe,
    SlimScroll,
    BoostrapCarouselComponent,
    SlideCarouselComponent,
    TripleSlidePipe,
    CompanyDetailComponent,
    CurateListPipe,
    ModeComponent,
    WriteReviewComponent,
    ImageModal,
    EventItemComponent,
    GeocodeMarkerComponent,
    MemberNavigationComponent,
    FollowingComponent,
    FollowerComponent,
    FollowItemComponent,
    BoostrapAlertComponent,
    InterestComponent,
    MemberComponent,
    MemberNavigationComponent,
    ProfileEditComponent,
    ProfilePublicComponent,
    InterestItemComponent,
    FavoriteComponent,
    FavoriteListComponent,
    FavoritePlaceComponent,
    FavoriteEventComponent,
    FavoritePipe,
    BoostrapAlertComponent,
    NotificationComponent,
    StarVoteComponent,
    LoaderComponent,
    Html2TextPipe,
    InstagramImageComponent
  ],
  imports: [ // import Angular's modules
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NouisliderModule,
    RouterModule.forRoot(ROUTES, {useHash: false, preloadingStrategy: PreloadAllModules}),
    AgmCoreModule.forRoot({
      // apiKey: 'AIzaSyDFn2a42XdwJAPtDUBCFq6jgTuMHmIoZEQ',
      apiKey: 'AIzaSyAkysiDbFxbIPSuVN4XM4R2YpbGUNzk0CY',
      libraries: ['places', 'geometry']
    }),
    NgbModule.forRoot(),
    TranslateModule.forRoot(),
    CountryPickerModule.forRoot({
      baseUrl: 'assets/'
    }),
    LocalStorageModule.withConfig({
      prefix: 'hylo-app',
      storageType: 'localStorage'
    }),
    Angular2FontawesomeModule,
    NguiDatetimePickerModule,
    Ng2ScrollableModule,
    MomentModule,
    TruncateModule,
    TinymceModule.withConfig({}),
    ReactiveFormsModule,
    ImageUploadModule,
    CountryPickerModule.forRoot({
      baseUrl: 'assets/'
    }),
    Daterangepicker
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    Title,
    GmapService,
    LoaderService,
    GoogleMapsAPIWrapper,
    EventService,
    CompanyService,
    EventService,
    BaseApiService,
    ModeService,
    HomeService
  ]
})
export class AppModule {

  constructor(public appRef: ApplicationRef,
              public appState: AppState) {
  }

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    // save state
    store.state = this.appState._state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
