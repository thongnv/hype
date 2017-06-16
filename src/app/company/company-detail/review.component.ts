import { Component, OnInit, Input } from '@angular/core';

import { HyloComment, Experience, BaseUser, Image } from '../../app.interface';
import { CompanyService } from '../../services/company.service';
import { CompanyDetailComponent } from './company-detail.component';

@Component({
  selector: 'company-review',
  template: `
    <div class="experiences-area border-bottom padding-bottom-35">
      <div class="information-experience">
        <img class="img-circle" [src]="author.avatar" alt="user avatar" width="70"
             height="70">
        <div class="content-info-experience">
          <h4>{{author.name}}</h4>
          <p class="info-date-experience">
            {{date | amTimeAgo}}
          </p>
        </div>
        <div class="rating-star">
          <rating [ngModel]="review.rating" [readonly]="true" emptyIcon="★"></rating>
        </div>
      </div>
      <p class="detail-info-experience clearfix" [innerHTML]="text"></p>
      <ul class="list-pictures-experience">
        <li *ngFor="let img of thumbImages; let i=index">
          <div class="float-left view-more" *ngIf="i<=4">
            <span *ngIf="i==4 && thumbImages.length > 5">
              <a class="more" (click)="OpenImageModel(img.img,thumbImages)"> 
                +{{thumbImages.length - 5}}
              </a>
              <span class="overlay"></span>
            </span>
            <img class="list-img" [src]="img.thumb" (click)="OpenImageModel(img.img,thumbImages)"
                 alt='Image {{i}}' width="100" height="100"/>
          </div>
        </li>
      </ul>
      <div *ngIf="openModalWindow">
        <ImageModal
          [modalImages]="thumbImages"
          [imagePointer]="imagePointer"
          (cancelcompany)="cancelImageModel()">
        </ImageModal>
      </div>

      <div class="likes-comments-experience-area clearfix">
        <div class="likes-area">
          <a (click)="toggleLikeReview()">
            <img *ngIf="!liked" src="/assets/img/company/detail/icon-like.png" alt="icon-like" width="24" height="23">
            <img *ngIf="liked" src="/assets/img/company/detail/icon-liked.png" alt="icon-like" width="24" height="23">
          </a>
          {{likeNumber}} Likes
        </div>
      </div>

    </div>
  `,
  styleUrls: ['./company-detail.component.css'],
})
export class ReviewComponent implements Experience, OnInit {
  @Input() public index: number;
  @Input() public review: Experience;

  public openModalWindow: boolean = false;
  public imagePointer: number;
  public currentUser: BaseUser;
  public id: number;
  public author: BaseUser;
  public rating: number;
  public date: number;
  public text: string;
  public images: Image[];
  public thumbImages: any[] = [];
  public comments: HyloComment[];
  public likeNumber: number;
  public liked: boolean;

  constructor(private companyService: CompanyService,
              private company: CompanyDetailComponent) {
  }

  public ngOnInit() {
    this.currentUser = this.company.user;
    this.id = this.review.id;
    this.author = this.review.author;
    this.rating = this.review.rating;
    this.date = this.review.date;
    this.text = this.review.text;
    this.images = this.review.images;
    this.comments = this.review.comments;
    this.likeNumber = this.review.likeNumber;
    this.liked = this.review.liked;

    for (let i of this.images) {
      this.thumbImages.push(
        {
          thumb: i.url,
          img: i.url,
          description: 'Thumb Image'
        }
      );
    }
  }

  public toggleLikeReview() {
    let liked = !this.liked;
    let review = this;
    this.companyService.toggleLike(review).subscribe(
      (resp) => {
        console.log(resp);
        this.liked = liked;
        this.likeNumber += liked ? 1 : -1;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public OpenImageModel(imageSrc, images) {
    let imageModalPointer;
    for (let i = 0; i < images.length; i++) {
      if (imageSrc === images[i].img) {
        imageModalPointer = i;
        break;
      }
    }
    this.openModalWindow = true;
    this.images = images;
    this.imagePointer = imageModalPointer;
  }

  public cancelImageModel() {
    this.openModalWindow = false;
  }

}
