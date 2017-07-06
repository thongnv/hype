import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { LoaderService } from '../../helper/loader/loader.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  public constructor(
     private localStorageService: LocalStorageService,
     private userService: UserService,
     private loaderService: LoaderService,
     private router: Router) {
  }

  public ngOnInit() {
    this.loaderService.show();
    this.userService.logout().subscribe(
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
