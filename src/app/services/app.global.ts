import { Injectable } from '@angular/core';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AppGlobals {
  // a isShowLeft data
  public isShowLeft = true;
  public isShowRight = true;

  // use this property for property binding
  public isLocationAddress: BehaviorSubject<string> = new BehaviorSubject<string>('Singapore');

  public setLocationAddress(isLocation) {
    this.isLocationAddress.next(isLocation);
  }
}
