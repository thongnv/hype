import { HyloLocation } from '../app.interface';
import { EventEmitter, Injectable, Output } from '@angular/core';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AppGlobals {
  public isShowLeft = true;
  public isShowRight = true;
  public toggleMap = false;

  public eventIcon = [
    {url: 'https://hylo.sg/assets/icon/locationmarker.png', name: 'default'},
    {url: 'https://s3-ap-southeast-1.amazonaws.com/live.hylosg/avatar/markers/art.png', name: 'art'},
    {url: 'https://s3-ap-southeast-1.amazonaws.com/live.hylosg/avatar/markers/camp.png', name: 'camp'},
    {url: 'https://s3-ap-southeast-1.amazonaws.com/live.hylosg/avatar/markers/dating.png', name: 'dating'},
    {url: 'https://s3-ap-southeast-1.amazonaws.com/live.hylosg/avatar/markers/education.png', name: 'education'},
    {url: 'https://s3-ap-southeast-1.amazonaws.com/live.hylosg/avatar/markers/food-promo.png', name: 'food promo'},
    {url: 'https://s3-ap-southeast-1.amazonaws.com/live.hylosg/avatar/markers/gaming.png', name: 'gaming'},
    {url: 'https://s3-ap-southeast-1.amazonaws.com/live.hylosg/avatar/markers/live-performance.png', name: 'life performance'},
    {url: 'https://s3-ap-southeast-1.amazonaws.com/live.hylosg/avatar/markers/music.png', name: 'music'},
    {url: 'https://s3-ap-southeast-1.amazonaws.com/live.hylosg/avatar/markers/night-life.png', name: 'nightlife'},
    {url: 'https://s3-ap-southeast-1.amazonaws.com/live.hylosg/avatar/markers/pop-up-fair.png', name: 'pop-up fair'},
    {url: 'https://s3-ap-southeast-1.amazonaws.com/live.hylosg/avatar/markers/shopping.png', name: 'shopping'},
    {url: 'https://s3-ap-southeast-1.amazonaws.com/live.hylosg/avatar/markers/sports.png', name: 'sports'},
    {url: 'https://s3-ap-southeast-1.amazonaws.com/live.hylosg/avatar/markers/tech.png', name: 'tech'}];

  public neighbourhoodStorage = new BehaviorSubject<HyloLocation>({name: 'Singapore', lat: 1.290270, lng: 103.851959});
  @Output() public typeChangeEmitter: EventEmitter<any> = new EventEmitter();

  public setLocationAddress(neighbourhood) {
    this.neighbourhoodStorage.next(neighbourhood);
  }

  public emitActiveType(type: string) {
    this.typeChangeEmitter.emit(type);
  }

  public getEmittedActiveType() {
    return this.typeChangeEmitter;
  }

}
