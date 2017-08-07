import { Component, HostListener, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../../services/main.service';
import { LoaderService } from '../../helper/loader/loader.service';
import { AppSetting } from '../../app.setting';
import { WindowUtilService } from '../../services/window-ultil.service';
import { Title } from '@angular/platform-browser';
import { User } from '../../app.interface';
import { LocalStorageService } from 'angular-2-local-storage';

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
  public noPause: boolean = false;
  public slides: any[] = [];

  public lat: number = 1.290270;
  public lng: number = 103.851959;
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
                     private windowRef: WindowUtilService) {
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    console.log(event);
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 180) / 2;
  }

  public ngOnInit() {
    let user = this.localStorageService.get('user') as User;
    if (user) {
      this.user = user;
    }
    this.gMapStyles = AppSetting.GMAP_STYLE;
    this.loaderService.show();
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 180) / 2;
    this.route.params.subscribe((e) => {
      this.slugName = e.slug;
      this.mainService.getArticle(this.slugName).subscribe(
        (response) => {
          this.article = response;
          this.isCurrentUser = this.article.user_post.slug === '/user/' + this.user.slug;
          this.initMap(this.article);
          this.titleService.setTitle(this.article.title);
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
        let marker = {
          lat: 1.290270,
          lng: 103.851959,
          opacity: 0.4,
          isOpenInfo: false,
          icon: 'assets/icon/locationmarker.png'
        };
        if (place.field_latitude !== '0' && place.field_longitude !== '0') {
          marker.lat = Number(place.field_latitude);
          marker.lng = Number(place.field_longitude);
          if (index === 0) {
            marker.opacity = 1;
            marker.isOpenInfo = true;
          }
        }
        index++;
        this.markers.push(marker);
      }
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
}
