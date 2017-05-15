import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {MainService} from '../../services/main.service';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

    constructor(
        private mainService: MainService,
        private router: Router
    ) {}

    logout(): void{
        this.mainService.logout().then(
            () => this.router.navigate(['/home'])
        );
    }

    ngOnInit() {
        this.logout();
    }

}
