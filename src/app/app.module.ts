import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  NgModule, ModuleWithProviders, ApplicationRef
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
import '../styles/styles.scss';
import '../styles/headings.css';
import { GmapComponent } from './gmap/gmap.component';
import { DiscoverComponent } from './discover/discover.component';
import { CurateComponent } from './curate/curate.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { CountryPickerModule } from 'angular2-countrypicker';
import { LocalStorageModule } from 'angular-2-local-storage';
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
import { MyArray } from './shared/pipes';
import { CustomMarkerComponent } from './gmap/custom-marker/custom-marker.component';
import { CurateDetailComponent } from './curate-detail/curate-detail.component';
import { CommentComponent } from './event/detail/comment.component';
import { ExperienceComponent } from './event/detail/experience.component';
import { MemberModule } from './member/member.module';
import { Angular2FontawesomeModule } from 'angular2-fontawesome';
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
    MyArray,
    CustomMarkerComponent,
    CurateDetailComponent
  ],
  imports: [ // import Angular's modules
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, {useHash: false, preloadingStrategy: PreloadAllModules}),
    AgmCoreModule.forRoot({
      // apiKey: 'AIzaSyDFn2a42XdwJAPtDUBCFq6jgTuMHmIoZEQ',
      apiKey: 'AIzaSyAkysiDbFxbIPSuVN4XM4R2YpbGUNzk0CY',
      libraries: ['places']
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
    MemberModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    Title,
    GmapService,
    GoogleMapsAPIWrapper,
    EventService
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
    const state = this.appState._state;
    store.state = state;
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
