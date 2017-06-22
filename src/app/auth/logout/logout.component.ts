import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { LoaderService } from '../../shared/loader/loader.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  public constructor(
                     private localStorageService: LocalStorageService,
                     private appState: AppState,
                     private loaderService: LoaderService) {
    this.loaderService.show();
  }

  public logout(): void {
    this.localStorageService.clearAll();
    this.appState.set('userInfo', null);
    setTimeout(() => {
      this.loaderService.hide();
      window.location.href = '/';
    }, 1000);
  }

  public ngOnInit() {
    this.logout();
  }

}
