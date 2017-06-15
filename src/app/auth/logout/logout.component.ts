import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MainService } from '../../services/main.service';
import { AppState } from '../../app.service';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  public constructor(private mainService: MainService,
                     private router: Router,
                     private localStorageService: LocalStorageService,
                     private appState: AppState) {
  }

  public logout(): void {
    this.mainService.logout().then(
      (resp) => {
        console.log(resp);
        if (resp.ok) {
          this.localStorageService.clearAll();
          this.appState.set('userInfo', null);
          window.location.href = '/';
        }
      }
    );
  }

  public ngOnInit() {
    this.logout();
  }

}
