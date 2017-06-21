import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { AppState } from '../../app.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { LoaderService } from '../../shared/loader/loader.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  public constructor(private mainService: MainService,
                     private localStorageService: LocalStorageService,
                     private appState: AppState, private loaderService: LoaderService) {
    this.loaderService.show();
  }

  public logout(): void {
    this.mainService.logout().then(
      (resp) => {
        console.log(resp);
        if (resp.ok) {
          window.location.href = '/';
        }
        this.loaderService.hide();
      }
    );
  }

  public ngOnInit() {
    this.logout();
  }

}
