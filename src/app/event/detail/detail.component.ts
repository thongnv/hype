import { Component, OnInit } from '@angular/core';

let IMAGES = [
  'http://www.angulartypescript.com/wp-content/uploads/2016/03/car1.jpg',
  'http://www.angulartypescript.com/wp-content/uploads/2016/03/car2.jpg',
  'http://www.angulartypescript.com/wp-content/uploads/2016/03/car3.jpg',
  'http://www.angulartypescript.com/wp-content/uploads/2016/03/car4.jpg',
  'http://www.angulartypescript.com/wp-content/uploads/2016/03/car5.jpg',
  'http://www.angulartypescript.com/wp-content/uploads/2016/03/car6.jpg',
  'http://www.angulartypescript.com/wp-content/uploads/2016/03/car6.jpg',
  'http://www.angulartypescript.com/wp-content/uploads/2016/03/car6.jpg',
];

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class EventDetailComponent implements OnInit {

  public NextPhotoInterval: number = 5000;
  public noLoopSlides: boolean = false;
  public lat: number;
  public lng: number;
  private images = [];

  constructor() {
    this.addNewSlide();
    this.lat = 1.290270;
    this.lng = 103.851959;
  }

  public ngOnInit() {
  }

  private addNewSlide() {
    for (let image of IMAGES) {
      this.images.push({image});
    }
  }

}