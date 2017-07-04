import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  NgModule, ApplicationRef, NO_ERRORS_SCHEMA
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
import { NoContentComponent } from './no-content';
import { ServerErrorComponent } from './server-error';


import { Ng2ScrollableModule } from 'ng2-scrollable';


import { TruncateModule } from 'ng2-truncate';

import '../styles/styles.scss';
import '../styles/headings.css';
import { GmapComponent } from './gmap/gmap.component';
import { DiscoverComponent } from './discover/discover.component';

import { TranslateModule } from '@ngx-translate/core';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';

import { CountryPickerModule } from 'angular2-countrypicker';
import { LocalStorageModule } from 'angular-2-local-storage';
import { ImageUploadModule } from 'ng2-imageupload';
import { NavbarComponent } from './navbar/navbar.component';
import { MainService } from './services/main.service';
import { GmapClustererDirective } from './gmap/custom-gmap.directive';
import { GmapService } from './services/gmap.service';
import { EventDetailComponent } from './event/detail/detail.component';

import { SlideComponent } from './event/detail/slide.component';
import { CarouselComponent } from './event/detail/carousel.component';
import { ShareEventComponent } from './event/share-event/share-event.component';
import { EventService } from './services/event.service';

import { MyArray } from './shared/num-to-array.pipe';
import { CommentComponent } from './event/detail/comment.component';
import { ExperienceComponent } from './event/detail/experience.component';
import { Angular2FontawesomeModule } from 'angular2-fontawesome';
import { MomentModule } from 'angular2-moment';
import { CurateListPipe } from './shared/curate-list.pipe';
import { TripleSlidePipe } from './shared/triple-slide.pipe';

import { BaseApiService } from './services/service_base.service';
import { ModeService } from './services/mode.service';
import { FollowingComponent } from './member/following/following.component';
import { MemberNavigationComponent } from './member/member-navigation/member-navigation.component';
import { FollowItemComponent } from './member/follow-item/follow-item.component';

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
import { StarVoteComponent } from './helper/star-vote/star-vote.component';
import { LoaderComponent } from './helper/loader/loader.component';
import { LoaderService } from './helper/loader/loader.service';

import { FacebookModule } from 'ngx-facebook';
import { AuthComponent } from './auth/auth.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { Ng2PopupModule } from 'ng2-popup/dist/index';
import { RatingModule } from 'ng2-rating';
import { SearchComponent } from './navbar/search/search.component';
import { HyperSearchComponent } from './hyper-search/hyper-search.component';

import {HtmlToTextModule} from './html-to-text/html-to-text.module';

// services
import {SeoService} from './services/seo.service';

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
    NoContentComponent,
    ServerErrorComponent,
    GmapComponent,
    DiscoverComponent,
    NavbarComponent,
    GmapClustererDirective,
    EventDetailComponent,
    SlideComponent,
    CarouselComponent,
    ShareEventComponent,
    CommentComponent,
    ExperienceComponent,
    MyArray,
    CurateListPipe,
    TripleSlidePipe,
    CurateListPipe,
    MemberNavigationComponent,
    FollowingComponent,
    FollowerComponent,
    FollowItemComponent,

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
    NotificationComponent,
    StarVoteComponent,
    LoaderComponent,
    AuthComponent,
    LogoutComponent,
    SearchComponent,
    HyperSearchComponent,
  ],
  imports: [ // import Angular's modules
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
    TruncateModule,
    HtmlToTextModule,
    RouterModule.forRoot(ROUTES, {useHash: false, preloadingStrategy: PreloadAllModules}),


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
    RatingModule,
    MomentModule,
    ReactiveFormsModule,
    CountryPickerModule.forRoot({
      baseUrl: 'assets/'
    }),
    Daterangepicker,
    FacebookModule.forRoot(),
    Ng2PopupModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    Title,
    GmapService,
    LoaderService,
    EventService,
    EventService,
    BaseApiService,
    ModeService,
    HomeService,
    SeoService,
  ],
  schemas: [NO_ERRORS_SCHEMA]
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
