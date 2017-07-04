import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { slideInOutAnimation } from '../../animations/slide-in-out.animation';
import { BaseUser, Company, Experience, Image, Location } from '../../app.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../../services/main.service';
import { LoaderService } from '../../shared/loader/loader.service';
import { AppSetting } from '../../app.setting';
import { LocalStorageService } from 'angular-2-local-storage';
@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css'],
  animations: [slideInOutAnimation],
})
export class CompanyDetailComponent implements Company, OnInit {
  public id: string;
  public name: string;
  public description: string;
  public rating: number;
  public location: Location;
  public website: string;
  public phone: string;
  public openingHours: string[];
  public reviews: Experience[] = [];
  public images: Image[];
  public instagramUrl = '';
  public slugName: string;
  public user: BaseUser = {name: '', avatar: '', slug: ''};
  public commentPosition = 'out';
  public companyStatus = 'default';
  public showForm = false;
  public NextPhotoInterval: number = 5000;
  public noLoopSlides: boolean = false;
  public noTransition: boolean = false;
  public slides = [{image: 'assets/img/company/detail/default-company.jpg'}];
  public descTruncated: boolean = true;
  public bookmarked: boolean = false;
  public rated: boolean = false;
  public company: Company;
  public ready: boolean = false;
  public imageReady: boolean = false;
  public gMapStyles: any;
  public loggedIn = Boolean(this._localStorageService.get('loginData'));

  constructor(
    private _localStorageService: LocalStorageService,
    public mainService: MainService,
    public companyService: CompanyService,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private router: Router
  ) {}

  public ngOnInit() {
    this.route.params.subscribe((e) => {
      this.slugName = e.slug;
      this.loaderService.show();
      this.companyService.getCompanyDetail(this.slugName).subscribe(
        (resp) => {
          this.company = CompanyService.extractCompanyDetail(resp);
          this.loadData(this.company);
          // TODO: use this.instagramUrl instead
          let instagramUsername = 'billnguyen254';
          this.companyService.getInstagramProfile(instagramUsername).subscribe(
            (profile) => {
              let userId = profile.data[0].id;
              this.companyService.getInstagramImages(userId).subscribe(
                (res) => {
                  let images = [];
                  for (let item of res.data) {
                    images.push({
                      url: item.images.standard_resolution.url,
                      value: '',
                      filename: '',
                      filemime: '',
                      filesize: 0
                    });
                  }
                  this.images = images;
                  this.initSlide(this.images);
                  this.imageReady = true;
                },
                (error) => {
                  console.log(error);
                }
              );
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
    if (this.loggedIn) {
      this.mainService.getUserProfile().subscribe((response) => {
        this.user = response;
      });
    }
    this.gMapStyles = AppSetting.GMAP_STYLE;
  }

  public toggleBookmark() {
    let bookmarked = !this.bookmarked;
    this.companyService.toggleBookmark(this.id).subscribe(
      (resp) => {
        console.log(resp);
        this.bookmarked = bookmarked;
      },
      (error) => {
        console.log(error);
      }
    );
  };

  public viewReviews() {
    this.commentPosition = 'in';
    this.companyStatus = 'hidden';
  }

  public showReviewModal() {
    if (this.loggedIn) {
      this.showForm = true;
    } else {
      this.router.navigate(['login'], {skipLocationChange: true}).then();
    }
  }

  public goBack() {
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
          console.log('review:', review);
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
    this.description = data.description;
    this.rating = data.rating;
    this.rated = data.rated;
    this.bookmarked = data.bookmarked;
    this.phone = data.phone;
    this.openingHours = data.openingHours;
    this.location = data.location;
    this.instagramUrl = data.instagramUrl;
  }

  private initSlide(images) {
    this.slides = [];
    for (let image of images) {
      this.slides.push({image: image.url});
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
