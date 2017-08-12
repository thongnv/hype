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
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/markers/art.png', name: 'art'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/markers/camp.png', name: 'camp'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/markers/dating.png', name: 'dating'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/markers/education.png', name: 'education'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/markers/food-promo.png', name: 'food promo'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/markers/gaming.png', name: 'gaming'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/markers/live-performance.png', name: 'life performance'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/markers/music.png', name: 'music'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/markers/night-life.png', name: 'nightlife'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/markers/pop-up-fair.png', name: 'pop-up fair'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/markers/shopping.png', name: 'shopping'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/markers/sports.png', name: 'sports'},
    {url: 'https://hylowebsite.s3.amazonaws.com/avatar/markers/tech.png', name: 'tech'},];

  // use this property for property binding
  public isLocationAddress: BehaviorSubject<string> = new BehaviorSubject<string>('Singapore');

  public setLocationAddress(isLocation) {
    this.isLocationAddress.next(isLocation);
  }
}
