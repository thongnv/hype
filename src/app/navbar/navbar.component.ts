import { Component, OnInit,ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { AppState } from '../app.service';
import { MainService } from '../services/main.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router,ActivatedRoute} from '@angular/router';
import {NotificationComponent} from "./notification/notification.component";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',

    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    public loginData:any;
    public isIn = false;
    public onMobile = false;
    public oncreate = false;
    public onsearch = false;
    public userInfo:any;
    public mapOptions:any[];
    public notifications:any;
    public selectedMapOption:any;
    public notificationPage:number = 0;
    public set:any = {
        offset: 0, endOfList: false, loadingInProgress: false
    };
    @ViewChild(NotificationComponent) NotificationComponent:NotificationComponent

    public constructor(public appState:AppState, private mainService:MainService,
                       private localStorageService:LocalStorageService,
                       private router:Router,
                       private activeRoute:ActivatedRoute,
                       private location:Location) {
        let notificationPage = this.appState.state.notificationPage;
        if (notificationPage !== undefined) {
            this.notificationPage = notificationPage;
        }
        this.appState.set('notificationPage', this.notificationPage);
    }

    public onSelectMapOption(option:any):void {
        this.selectedMapOption = option;
        this.router.navigate(['/discover/' + option.name.replace(" ","+")]);
    }

    public toggleState() {
        this.isIn = !this.isIn;
        this.onMobile = !this.onMobile;
        this.oncreate = false;
        this.onsearch = false;
        this.NotificationComponent.onNotify = false;
    }

    public onClickNotify(event) {
        this.isIn = false;
        this.onMobile = false;
        this.oncreate = false;
        this.onsearch = false;
    }

    public mobile_searchState() {
        this.onsearch = !this.onsearch;
        this.oncreate = false;
        this.NotificationComponent.onNotify = false;
    }

    public mobile_createState() {
        this.oncreate = !this.oncreate;
        this.onsearch = false;
        this.NotificationComponent.onNotify = false;

    }

    public ngOnInit() {
        let nbList = ['Alexandra', 'Aljunied', 'Amoy Street', 'Ang Mo Kio', 'Balestier', 'Bartley',
            'Bayfront', 'Beach Road', 'Beauty World', 'Bedok', 'Bedok Reservoir', 'Bencoolen', 'Bishan',
            'Boat Quay', 'Boon Keng', 'Boon Lay', 'Botanic Gardens', 'Braddell', 'Bras Basah', 'Buangkok',
            'Bugis', 'Bukit Batok', 'Bukit Gombak', 'Bukit Merah', 'Bukit Panjang', 'Bukit Timah',
            'Buona Vista', 'Changi', 'Changi Airport', 'China Square Central', 'Chinatown',
            'Chinese Garden', 'Chip Bee Gardens', 'Choa Chu Kang', 'Circular Road', 'City Hall',
            'Clarke Quay', 'Clementi', 'Club Street', 'Commonwealth',
            'Coronation', 'Dakota', 'Dempsey', 'Dhoby Ghaut', 'Dover', 'Downtown', 'Duxton',
            'East Coast Parkway', 'Esplanade', 'Eunos', 'Everton Park', 'Expo', 'Farrer Park',
            'Farrer Road', 'Fort Canning', 'Gardens by the Bay', 'Geylang', 'Geylang Bahru',
            'Great World', 'Haji Lane', 'Harbourfront', 'Hillview', 'Holland Village',
            'Hougang', 'Jalan Besar', 'Jalan Kayu', 'Jalan Riang', 'Joo Chiat', 'Jurong East',
            'Jurong West', 'Kaki Bukit', 'Kallang', 'Katong', 'Kembangan', 'Kent Ridge',
            'Khatib', 'King Albert Park', 'Kovan', 'Labrador', 'Lakeside', 'Lavender',
            'Little India', 'Lorong Kilat', 'Macpherson', 'Marina Bay', 'Marina Square',
            'Marine Parade', 'Marymount', 'Maxwell', 'Millenia Walk', 'Mountbatten',
            'Newton', 'North Bridge Road', 'Novena', 'Old Airport Road', 'One North', 'Orchard',
            'Orchard Road', 'Outram Park', 'Pasir Panjang', 'Pasir Ris', 'Paya Lebar', 'Portsdown',
            'Potong Pasir', 'Promenade', 'Punggol', 'Punggol Waterway', 'Queenstown', 'Raffles Place',
            'Rangoon Road', 'Redhill', 'River Valley', 'Robertson Quay', 'Rochor', 'Seletar', 'Sembawang',
            'Sengkang', 'Sentosa', 'Serangoon', 'Serangoon Gardens', 'Shenton Way', 'Siglap', 'Simei',
            'Simpang Bedok', 'Sixth Avenue', 'Somerset', 'Stadium', 'Stevens', 'Tai Seng', 'Tampines',
            'Tanah Merah', 'Tanglin', 'Tanjong Katong', 'Tanjong Pagar', 'Telok Ayer', 'Telok Blangah',
            'Thomson', 'Tiong Bahru', 'Toa Payoh', 'Tuas', 'Upper Bukit Timah', 'Upper East Coast Road',
            'West Coast', 'Woodlands', 'Yio Chu Kang', 'Yishun'];
        this.loginData = this.localStorageService.get('loginData') ?
            JSON.parse(<string> this.localStorageService.get('loginData')) : null;
        console.log('local storage: ', this.loginData);
        this.appState.set('loginData', this.loginData);
        this.userInfo = this.appState.state.userInfo;

        this.mapOptions = [
            {id: 1, name: 'Singapore'},
        ];
        nbList.forEach((item, index) => {
            this.mapOptions.push({id: index + 2, name: item});
        });
        // get current param
        let params_url = this.location.path().split("/");
        console.log(params_url);
        if (params_url[1]=='discover') {
            if(params_url[2]) {
                this.selectedMapOption = {id: 0, name: params_url[2].replace("%2B", " ").replace("%20", " ")};
            }
        } else {
            this.selectedMapOption = this.mapOptions[0];
        }
        console.log(this.selectedMapOption);
        if (this.loginData) {
            this.getNotifications();
        }
    }


    public getNotifications() {
        this.mainService.getNotifications(this.notificationPage).then((resp) => {
            this.notifications = resp.data;
            console.log('this.notifications', this.notifications);
        });
    }

    public onMarkAllRead() {
        this.notifications.results.forEach((notif) => {
            notif.viewed = 'true';
        });
        this.notifications.unread = 0;
        this.mainService.updateNotifications('all', null).then((resp) => {
            console.log('resp', resp);
        });
    }

    public onMarkOneRead(item) {
        item.viewed = true;
        this.mainService.updateNotifications('any', item.mid).then((resp) => {
            console.log('resp', resp);
        });
    }

    public onScrollToBottom() {
        if (!this.set.loadingInProgress) {
            this.set.endOfList = false;
            this.set.loadingInProgress = true;
            let count = 0;
            this.mainService.getNotifications(++this.notificationPage).then((response) => {
                if (response.data.results.length) {
                    response.data.results.forEach((item) => {
                        count++;
                        this.notifications.results.push(item);
                    });
                    if (count === 0) {
                        this.set.endOfList = true;
                        this.notificationPage--;
                    }
                } else {
                    this.set.endOfList = true;
                }
                this.set.loadingInProgress = false;
            });
        }
    }
}
