import { Component, HostListener, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { slideInOutAnimation } from '../../animations/slide-in-out.animation';
import { Company, Experience, Image, HyloLocation, User } from '../../app.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../helper/loader/loader.service';
import { AppSetting } from '../../app.setting';
import { AppGlobals } from '../../services/app.global';
import { LocalStorageService } from 'angular-2-local-storage';
import { UserService } from '../../services/user.service';
import { WindowUtilService } from '../../services/window-ultil.service';
import { Title } from '@angular/platform-browser';
import { Location as LocationService } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css'],
  animations: [slideInOutAnimation],
})
export class CompanyDetailComponent implements Company, OnInit {
  public id: string;
  public name: string;
  public type: string;
  public description: string;
  public rating: number;
  public location: HyloLocation;
  public website: string;
  public phone: string;
  public openingHours: string[];
  public reviews: Experience[] = [];
  public images: Image[];
  public instagramUrl = '';
  public licenseNumber = '';
  public CTC = '';
  public slugName: string;
  public user = AppSetting.defaultUser;
  public commentPosition = 'out';
  public companyStatus = 'default';
  public showForm = false;
  public showBooking = false;

  public NextPhotoInterval: number = 5000;
  public noLoopSlides: boolean = false;
  public noTransition: boolean = false;
  public slides = [{image: 'assets/img/company/detail/default-company.jpg'}];
  public descTruncated: boolean = true;
  public bookmarked: boolean = false;
  public rated: boolean = false;
  public company: Company;
  public ready: boolean = false;
  public gMapStyles: any;
  public layoutWidth: number;
  public innerWidth: number;

  constructor(private titleService: Title,
              private localStorageService: LocalStorageService,
              public userService: UserService,
              public companyService: CompanyService,
              public sanitizer: DomSanitizer,
              private route: ActivatedRoute,
              private loaderService: LoaderService,
              private router: Router,
              private locationService: LocationService,
              private windowRef: WindowUtilService,
              public appGlobal: AppGlobals) {
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 180);

    if (this.innerWidth > 900) {
      this.appGlobal.isShowLeft = true;
      this.appGlobal.isShowRight = true;
    }
  }

  public ngOnInit() {
    let user = this.localStorageService.get('user') as User;
    if (user) {
      this.user = user;
    }
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;

    if (this.innerWidth <= 900) {
      this.appGlobal.isShowLeft = true;
      this.appGlobal.isShowRight = false;
    } else {
      this.appGlobal.isShowLeft = true;
      this.appGlobal.isShowRight = true;
    }

    this.layoutWidth = (this.windowRef.rootContainer.width - 180);

    this.appGlobal.toggleMap = true;

    this.route.params.subscribe((e) => {
      this.slugName = e.slug;
      this.loaderService.show();
      this.companyService.getCompanyDetail(this.slugName).subscribe(
        (resp) => {
          this.company = CompanyService.extractCompanyDetail(resp);
          this.loadData(this.company);
          this.appGlobal.emitActiveType(this.company.type);
          this.titleService.setTitle(this.company.name);
          this.companyService.getInstagramProfile(this.company.licenseNumber).subscribe(
            (images) => {
              if (images.length) {
                this.images = images;
                this.initSlide(this.images);
              }
            },
            (error) => {
              console.log(error);
            }
          );
          this.ready = true;
          this.loaderService.hide();
        },
        (error) => {
          this.loaderService.hide();
          console.log(error);
        }
      );
    });
    if (!this.user.isAnonymous) {
      this.userService.getProfile().subscribe((response) => {
        this.user = response;
      });
    }
    this.gMapStyles = AppSetting.GMAP_STYLE;
  }

  public goBack() {
    this.locationService.back();
  }

  public toggleBookmark() {
    if (!this.user || this.user.isAnonymous) {
      this.router.navigate(['/login'], {skipLocationChange: true}).then();
      return;
    }
    this.bookmarked = !this.bookmarked;
    this.companyService.toggleBookmark(this.id).subscribe(
      (resp) => {
        console.log(resp);
      },
      (error) => {
        this.bookmarked = !this.bookmarked;
        console.log(error);
      }
    );
  };

  public viewReviews() {
    this.commentPosition = 'in';
    this.companyStatus = 'hidden';
  }

  public showReviewModal() {
    if (!this.user.isAnonymous) {
      this.showForm = true;
    } else {
      this.router.navigate(['login'], {skipLocationChange: true}).then();
    }
  }

  public showBookingModal() {
    this.showBooking = true;

  }

  public closeBookingModal() {
    this.showBooking = false;
  }

  public back() {
    this.commentPosition = 'out';
    this.companyStatus = 'default';
  }

  public postReview(data) {
    if (data === false) {
      this.showForm = false;
    }
    if (!this.rated && data.text) {
      this.showForm = false;
      this.rated = true;
      this.loaderService.show();
      let postData = {
        idsno: this.id,
        company_name: this.name,
        slug: this.slugName,
        rate: data.rating,
        body: data.text,
        images: data.images
      };
      this.companyService.postReview(postData).subscribe(
        (resp) => {
          let review: Experience = {
            id: resp.rid,
            author: this.user,
            rating: resp.rate,
            date: Number(resp.created) * 1000,
            text: resp.body,
            images: extractImages(resp.image),
            comments: [],
            likeNumber: 0,
            liked: false
          };
          this.reviews.unshift(review);
          this.loaderService.hide();
        },
        (error) => {
          console.log(error);
          this.rated = false;
          this.loaderService.hide();
        }
      );
    }
  }

  public showMore() {
    this.descTruncated = false;
  }

  public showLess() {
    this.descTruncated = true;
  }

  public onLikeReview(item: Experience): void {
    this.companyService.toggleLike(item).subscribe(
      (resp) => {
        console.log(resp);
        item.liked = resp;
        item.likeNumber += resp ? 1 : -1;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private loadData(data) {
    this.id = data.id;
    this.website = data.website;
    this.reviews = data.reviews;
    this.name = data.name;
    this.description = escapeHtml(data.description);
    this.rating = data.rating;
    this.rated = data.rated;
    this.bookmarked = data.bookmarked;
    this.phone = data.phone;
    this.openingHours = data.openingHours;
    this.location = data.location;
    this.instagramUrl = data.instagramUrl;
    this.CTC = data.CTC;
  }

  private initSlide(images) {
    this.slides = [];
    for (let img of images) {
      this.slides.push({image: img});
    }
  }

}

function extractImages(data): Image[] {
  if (!data) {
    return [];
  }
  let images = [];
  for (let item of data) {
    images.push(
      {
        url: item,
        value: '',
        filename: '',
        filemime: '',
        filesize: 0,
      }
    );
  }
  return images;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\ufffd/g, '')
    .replace(/\ufffdI/g, '')
    .replace(/\ufffds/g, '');
}
