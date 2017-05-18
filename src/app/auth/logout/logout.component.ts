import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  public constructor(private mainService: MainService,
                     private router: Router) {
  }

  public logout(): void {
    this.mainService.logout().then(
      (resp) => {
        console.log(resp);
        if (resp.ok) {
          this.router.navigate(['/home']);
        }
      }
    );
  }

  public ngOnInit() {
    this.logout();
  }

}
