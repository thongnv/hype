import { Injectable } from '@angular/core';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AppGlobals {
  // a isShowLeft data
  public isShowLeft = true;
  public isShowRight = true;
  public toggleMap = false;

  // events icon
  public eventIcon = [
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/2017-07/art.png', name: 'art'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/2017-07/camp.png', name: 'camp'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/2017-07/dating_0.png', name: 'dating'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/2017-07/education.png', name: 'education'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/2017-07/food-promo.png', name: 'food promo'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/2017-07/gaming.png', name: 'gaming'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/2017-07/art.png', name: 'lifestyle'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/2017-07/live-performance.png', name: 'life performance'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/2017-07/music.png', name: 'music'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/2017-07/night-life.png', name: 'nightlife'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/2017-07/pop-up-fair_0.png', name: 'pop-up fair'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/2017-07/shopping.png', name: 'shopping'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/2017-07/sports.png', name: 'sports'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/2017-07/tech.png', name: 'tech'},
  ];

  // use this property for property binding
  public isLocationAddress: BehaviorSubject<string> = new BehaviorSubject<string>('Singapore');

  public setLocationAddress(isLocation) {
    this.isLocationAddress.next(isLocation);
  }
}
