import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { HyloComment, Experience, BaseUser, Image } from '../../app.interface';
import { EventDetailComponent } from './detail.component';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'event-experience',
  template: `
    <div class="experiences-area border-bottom padding-top-30 padding-bottom-35">
      <div class="information-experience">
        <div class="memberRate">
        <img class="img-circle" [src]="author.avatar" alt="user avatar" width="70"
             height="70">
        <div class="content-info-experience">
          <h4>{{author.name}}</h4>
          <p class="info-date-experience">
            {{date | date:'d MMMM y'}}
          </p>
        </div>
          <div class="clear"></div>
        </div>
        <div class="list-stars-review-experience">
          <rating [ngModel]="rating" [readonly]="true" emptyIcon="★"></rating>
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
            <img class="list-img" [src]="sanitizer.bypassSecurityTrustUrl(img.thumb)" (click)="OpenImageModel(img.img,thumbImages)"
                 alt='Image {{i}}' width="100" height="100"/>
          </div>
        </li>
      </ul>
      <div *ngIf="openModalWindow">
        <ImageModal
          [modalImages]="thumbImages"
          [imagePointer]="imagePointer"
          (cancelEvent)="cancelImageModel()">
        </ImageModal>
      </div>

      <div class="likes-comments-experience-area clearfix">
        <div class="likes-area">
          <a (click)="toggleLikeExperience()">
            <img *ngIf="!liked" src="/assets/img/event/detail/icon-like.png" alt="icon-like">
            <img *ngIf="liked" src="/assets/img/event/detail/icon-liked.png" alt="icon-like" width="24" height="23">
            <span [class.liked]="liked">{{likeNumber}} Likes</span>
          </a>
        </div>
        <div class="comments-area" (click)="onClickFocusMsgInput()">
          <a>
            <img class="icon-comment" src="/assets/img/event/detail/icon-comment.png" alt="icon-comment">
            {{comments.length}} Comments
          </a>
        </div>
        <div class="report-area">
          <a>
            <img class="icon-report" src="/assets/img/event/detail/icon-report.png" alt="icon-report">
          </a>
          <a>
            Report
          </a>
        </div>
      </div>

    </div>

    <!-- write your comment start -->
    <div class="write-your-comment border-bottom padding-top-30 padding-bottom-35">

      <div class="write-comment-area">
        <img class="img-circle" [src]="currentUser.avatar" alt="user avatar" width="50" height="50">
        <textarea #commentInput placeholder="Write your comment"
                  (keydown.enter)="addComment(commentInput);false"></textarea>
      </div>

      <ul class="list-comments-ago">
        <li *ngFor="let comment of comments.slice(0, commentIndex)">
          <app-comment [comment]="comment">
          </app-comment>
        </li>
      </ul>

      <div class="view-more-comments clearfix" *ngIf="commentIndex < comments.length && comments.length > 2">
        <a class="button-view-more-comments" (click)="viewMoreComments()">View more comments</a>
        <span class="count-comments">{{commentIndex}} of {{comments.length}}</span>
      </div>

    </div>
    <!-- write your comment end -->
  `,
  styleUrls: ['./detail.component.css']
})
export class ExperienceComponent implements Experience, OnInit {
  @Input() public index: number;
  @Input() public experience: Experience;

  @ViewChild('commentInput') public commentInput: ElementRef;

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
  public clickedLike = false;
  public commentIndex = 2;

  constructor(private eventService: EventService,
              private event: EventDetailComponent,
              public sanitizer: DomSanitizer,
              private router: Router) {
  }

  public ngOnInit() {
    this.currentUser = this.event.user;
    this.id = this.experience.id;
    this.author = this.experience.author;
    this.rating = this.experience.rating;
    this.date = this.experience.date;
    this.text = this.experience.text;
    this.images = this.experience.images;
    this.comments = this.experience.comments;
    this.likeNumber = this.experience.likeNumber;
    this.liked = this.experience.liked;

    if (this.commentIndex > this.comments.length) {
      this.commentIndex = this.comments.length;
    }
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

  public onClickFocusMsgInput() {
    this.commentInput.nativeElement.focus();
  }

  public addComment(msgInput) {
    if (this.event.user.isAnonymous) {
      this.router.navigate(['/login'], {skipLocationChange: true}).then();
    }
    if (msgInput.value.trim()) {
      let eventSlugName = this.event.slugName;
      let data = {
        pid: this.id,
        message: msgInput.value,
      };
      msgInput.value = '';
      this.eventService.postComment(eventSlugName, data).subscribe(
        (resp: HyloComment) => {
          console.log(resp);
          this.comments.push(resp);
          this.commentIndex += 1;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  public viewMoreComments() {
    if (this.commentIndex + 10 < this.comments.length) {
      this.commentIndex += 10;
    } else {
      this.commentIndex = this.comments.length;
    }
  }

  public toggleLikeExperience() {
    if (!this.clickedLike) {
      this.liked = !this.liked;
      this.likeNumber += this.liked ? 1 : -1;
      this.clickedLike = true;
      this.eventService.toggleLike(this.event.id, this.id, this.liked).subscribe(
        (resp) => {
          console.log(resp);
          this.clickedLike = false;
        },
        (error) => {
          this.likeNumber -= this.liked ? 1 : -1;
          this.liked = !this.liked;
          this.clickedLike = false;
          console.log(error);
        }
      );
    }
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
