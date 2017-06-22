import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../services/main.service';
import { LoaderService } from '../shared/loader/loader.service';
import { scrollTo } from 'ng2-utils';
import { AppSetting } from '../app.setting';

@Injectable()
@Component({
  selector: 'app-curate-detail',
  templateUrl: './curate-detail.component.html',
  styleUrls: ['./curate-detail.component.css'],
})
export class CurateDetailComponent implements OnInit {
  public article: any;
  public gMapStyles: any;
  public currentHighlightedMarker: any;
  public markers: any[] = [];
  public showMap: boolean = false;
  public slugName: string = '';

  public NextPhotoInterval: number = 5000;
  public noLoopSlides: boolean = false;
  public noTransition: boolean = false;
  public slides: any[] = [];

  public lat: number = 1.290270;
  public lng: number = 103.851959;
  public zoom: number = 12;
  public constructor(private mainService: MainService,
                     private loaderService: LoaderService,
                     private route: ActivatedRoute,
                     private router: Router) {
  }

  public ngOnInit() {
    this.gMapStyles = AppSetting.GMAP_STYLE
    this.loaderService.show();
    this.route.params.subscribe((e) => {
      this.slugName = e.slug;
      this.mainService.getArticle(this.slugName).subscribe(
        (response) => {
          this.article = response;
          this.initMap(this.article);
          this.getCenterMarkers();
          this.loaderService.hide();
        },
        (error) => {
          console.log(error);
          this.router.navigate(['404']).then();
        }
      );
    });
  }

  public getCenterMarkers() {

    let lat: number = 0;
    let lng: number = 0;

    this.markers.forEach( (marker) => {
      lat += marker.lat;
      lng += marker.lng;
    });

    this.lat = lat / this.markers.length;
    this.lng = lng / this.markers.length;
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
    this.currentHighlightedMarker = markerId;
    this.highlightMarker(markerId);

    const element = document.querySelector('#place-' + markerId);
    element.scrollIntoView({block: 'end',  behavior: 'smooth'});

    // TODO: fix highlight right marker and make scroll smoothly
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
  private initMap(article: any) {
    this.currentHighlightedMarker = 0;
    this.slides = [];
    this.markers = [];
    if (article.field_places && article.field_places.length) {
      let index = 0;
      for (let place of article.field_places) {
        if (place.field_latitude && place.field_latitude) {
          if (index === 0) {
            this.markers.push({
              lat: Number(place.field_latitude),
              lng: Number(place.field_longitude),
              opacity: 1,
              isOpenInfo: true,
              icon: 'assets/icon/icon_pointer.png'
            });
          } else {
            this.markers.push({
              lat: Number(place.field_latitude),
              lng: Number(place.field_longitude),
              opacity: 0.4,
              isOpenInfo: false,
              icon: 'assets/icon/icon_pointer.png'
            });
          }
          index++;
        }
      }
      this.showMap = true;
    }
    if (article.field_images && article.field_images.length) {
      for (let img of article.field_images) {
        if (img) {
          this.slides.push({image: img, active: false});
        }
      }

    }
  }
}
