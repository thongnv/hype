import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../../services/main.service';
import { LoaderService } from '../../helper/loader/loader.service';
import { AppSetting } from '../../app.setting';
import { WindowUtilService } from '../../services/window-ultil.service';
import { Title, Meta } from '@angular/platform-browser';
import { User } from '../../app.interface';
import { LocalStorageService } from 'angular-2-local-storage';
import { AppGlobals } from '../../services/app.global';

@Component({
  selector: 'app-curate-detail',
  templateUrl: './curate-detail.component.html',
  styleUrls: ['./curate-detail.component.css'],
})

export class CurateDetailComponent implements OnInit {
  public article: any;
  public gMapStyles: any;
  public currentHighlightedMarker: any;
  public markers = [];
  public showMap = false;
  public slugName = '';

  public NextPhotoInterval= 5000;
  public noLoopSlides = false;
  public noTransition = false;
  public noPause = false;
  public slides = [];

  public lat = AppSetting.SingaporeLatLng.lat;
  public lng = AppSetting.SingaporeLatLng.lng;
  public zoom: number = 12;
  public layoutWidth: number;
  public innerWidth: number;
  public user: User;
  public isCurrentUser: boolean;

  public constructor(private localStorageService: LocalStorageService,
                     private mainService: MainService,
                     private loaderService: LoaderService,
                     private route: ActivatedRoute,
                     private router: Router,
                     private titleService: Title,
                     private meta: Meta,
                     private appGlobal: AppGlobals,
                     private windowRef: WindowUtilService) {
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    console.log(event);
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 180) / 2;

    if (this.innerWidth > 900) {
      this.appGlobal.isShowLeft = true;
      this.appGlobal.isShowRight = true;
    }
  }

  public ngOnInit() {
    this.appGlobal.emitActiveType('guides');
    let user = this.localStorageService.get('user') as User;
    if (user) {
      this.user = user;
    }
    this.gMapStyles = AppSetting.GMAP_STYLE;
    this.loaderService.show();
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;

    if (this.innerWidth <= 900) {
      this.appGlobal.isShowLeft = true;
      this.appGlobal.isShowRight = false;
    } else {
      this.appGlobal.isShowLeft = true;
      this.appGlobal.isShowRight = true;
    }
    this.layoutWidth = (this.windowRef.rootContainer.width - 180) / 2;

    this.appGlobal.toggleMap = true;

    this.route.params.subscribe((e) => {
      this.slugName = e.slug;
      this.mainService.getArticle(this.slugName).subscribe(
        (response) => {
          this.article = response;
          let metaTags = response.meta_tags;
          // Seo meta tags
          if (metaTags) {
            this.titleService.setTitle(metaTags.title);
            this.meta.updateTag({name: 'description', content: metaTags.description});
            this.meta.addTag(
              {name: 'keywords', content: metaTags.keywords}
            );
            if (metaTags.canonical_url) {
              this.meta.addTag({rel: 'canonical', href: metaTags.canonical_url});
            }
          } else {
            console.log('here');
            this.titleService.setTitle(response.title);
            this.meta.updateTag({
              name: 'description',
              content: response.body.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 200)
            });
          }

          if (this.user) {
            this.isCurrentUser = this.article.user_post.slug === '/user/' + this.user.slug;
          }
          this.initMap(this.article);
          this.getCenterMarkers();
          this.loaderService.hide();
          window.scrollTo(0, 0);
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
    this.markers.forEach((marker) => {
      lat += marker.lat;
      lng += marker.lng;
    });
    this.lat = lat / this.markers.length;
    this.lng = lng / this.markers.length;
  }

  public markerClick(markerId) {
    this.currentHighlightedMarker = markerId;
    this.highlightMarker(markerId);
    const element = document.querySelector('#place-' + markerId);
    element.scrollIntoView({block: 'end', behavior: 'smooth'});
    window.scrollBy(0, -50);
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
        let marker = {
          lat: +place.field_latitude || AppSetting.SingaporeLatLng.lat,
          lng: +place.field_longitude || AppSetting.SingaporeLatLng.lng,
          opacity: 0.4,
          isOpenInfo: false,
          icon: 'assets/icon/locationmarker.png'
        };
        if (index === 0) {
          marker.opacity = 1;
          marker.isOpenInfo = true;
        }
        index++;
        this.markers.push(marker);
      }
      this.need2Zoom();
      this.showMap = true;
    }

    if (article.field_images && article.field_images.length) {
      for (let img of article.field_images) {
        if (img) {
          this.slides.push({image: img.url, active: false});
        }
      }
    }
  }

  // decide to zoom map if necessary
  private need2Zoom() {
    let distances = [];
    this.markers.forEach((marker) => {
      this.markers.forEach((otherMarker) => {
        if (otherMarker !== marker) {
          distances.push(getDistance(marker, otherMarker));
        }
      });
    });
    distances.sort((a, b) => a - b);
    let averageDistance = (distances[0] + distances[distances.length - 1]) / 2;
    let centerMarker = distances[Math.floor(distances.length / 2)];

    // 19 is zoom value of map should first fit to view every markers that nearest markers pair about 30m
    if (averageDistance < 40) {
      this.lat = centerMarker.lat;
      this.lng = centerMarker.lng;
      this.zoom = 19;
    }
  }
}

function getDistance(p1, p2) {
  let R = 6378137; // Earth’s mean radius in meter
  let dLat = rad(p2.lat - p1.lat);
  let dLong = rad(p2.lng - p1.lng);
  let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function rad(x) {
  return x * Math.PI / 180;
}
