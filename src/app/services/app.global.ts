import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
@Injectable ()
export class AppGlobals {
// use this property for property binding
    public isLocationAddress:BehaviorSubject<string> = new BehaviorSubject<string> ('Singapore');

    setLocationAddress (isLocation) {
        this.isLocationAddress.next (isLocation);
    }
}