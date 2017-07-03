import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { LoaderService } from '../../shared/loader/loader.service';
import { MainService } from '../../services/main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  public constructor(
     private localStorageService: LocalStorageService,
     private appState: AppState,
     private mainService: MainService,
     private loaderService: LoaderService,
     private router: Router) {
  }

  public ngOnInit() {
    this.loaderService.show();
    this.appState.set('userInfo', null);
    this.mainService.logout().subscribe(
      (res) => {
        console.log(res);
        this.localStorageService.clearAll();
        this.router.navigate(['home']).then();
        window.location.reload();
      },
      (error) => {
        console.log(error);
      },
      () => this.loaderService.hide()
    );
  }

}
