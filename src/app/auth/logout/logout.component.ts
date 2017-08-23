import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AppSetting } from '../../app.setting';
import { AppGlobals } from '../../services/app.global';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  public constructor(
     private localStorageService: LocalStorageService,
     private userService: UserService,
     private appGlobal: AppGlobals,
     private router: Router) {
  }

  public ngOnInit() {
    this.appGlobal.emitActiveType('');
    this.userService.logout().subscribe(
      (res) => {
        console.log(res);
        this.goHome();
      },
      (error) => {
        console.log(error);
        this.goHome();
      }
    );
  }

  private goHome() {
    this.localStorageService.clearAll();
    this.router.navigate(['home']).then(
      (response) => {
        console.log(response);
        this.userService.emitUser(AppSetting.defaultUser);
      }
    );
  }

}
