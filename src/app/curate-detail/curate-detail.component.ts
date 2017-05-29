import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-curate-detail',
  templateUrl: './curate-detail.component.html',
  styleUrls: ['./curate-detail.component.css']
})
export class CurateDetailComponent implements OnInit {
  public curate: any;
  public currentHighlightedMarker: any;
  public markers: any[] = [];

  public NextPhotoInterval: number = 5000;
  public noLoopSlides: boolean = false;
  public noTransition: boolean = false;
  public slides: any[] = [];

  public lat: number = 1.290270;
  public lng: number = 103.851959;
  public zoom: number = 12;
  public constructor(private mainService: MainService) {
  }

  public ngOnInit() {
    this.mainService.getUserPublicProfile().then((resp) => {
      this.curate = resp.curate;
      this.initMap();
    });
  }
  public onScroll(event) {
    let baseHeight = event.target.clientHeight;
    let realScrollTop = event.target.scrollTop + baseHeight;
    let currentHeight: number = baseHeight;

    if (event.target.children.length > 1) {
      for (let i = 0; i < event.target.children.length; i++) {
        let currentClientH = event.target.children[i].clientHeight;
        currentHeight += currentClientH;
        if (currentHeight - currentClientH <= realScrollTop && realScrollTop <= currentHeight) {
          if (this.currentHighlightedMarker !== i) {
            this.currentHighlightedMarker = i;
            this.highlightMarker(i);
          }
        }
      }
    }
  }
  public markerClick(markerId) {
    console.log('markerClick', markerId);
  }
  private highlightMarker(markerId: number): void {
    if (this.markers[markerId]) {
      this.markers.forEach((marker, index) => {
        if (index === markerId) {
          this.markers[index].opacity = 1;
          this.markers[index].isOpenInfo = true;
        } else {
          this.markers[index].opacity = 0.4;
          this.markers[index].isOpenInfo = false;
        }
      });
    }
  }
  private initMap() {
    this.currentHighlightedMarker = 0;
    this.slides = [];
    this.markers = [];
    if (this.curate.info.listPlaces.length) {
      let index = 0;
      for (let place of this.curate.info.listPlaces) {
        if (place.lat && place.lng) {
          if (index === 0) {
            this.markers.push({lat: place.lat, lng: place.lng, opacity: 1, isOpenInfo: true});
          } else {
            this.markers.push({lat: place.lat, lng: place.lng, opacity: 0.4, isOpenInfo: false});
          }
          index++;
        }
      }
      if (this.curate.images.length) {
        for (let img of this.curate.images) {
          if (img) {
            this.slides.push({image: img, active: false});
          }
        }

      }
    }
  }
}
