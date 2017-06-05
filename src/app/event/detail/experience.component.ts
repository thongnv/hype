import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { HyloComment, User, Experience } from '../../app.interface';
import { EventDetailComponent } from './detail.component';

@Component({
  selector: 'event-experience',
  template: `
    <div class="experiences-area border-bottom padding-top-30 padding-bottom-35">
      <div class="information-experience">
        <img class="img-circle" [src]="user.avatar" alt="user avatar" width="70"
             height="70">
        <div class="content-info-experience">
          <h4>{{user.firstName + ' ' + user.lastName}}</h4>
          <p class="info-date-experience">
            {{date | date:'d MMMM y'}}
          </p>
        </div>
        <ul class="list-stars-review-experience">
          <li *ngFor="let i of rating | myArray">
            <img src="/assets/img/event/detail/small-star-selected.png"
                 alt="small-star-selected">
          </li>

          <li *ngFor="let i of 5 - rating | myArray">
            <img src="/assets/img/event/detail/small-star.png"
                 alt="small-star">
          </li>
        </ul>
      </div>
      <p class="detail-info-experience clearfix" [innerHTML]="text"></p>
      <ul class="list-pictures-experience">
        <li *ngFor="let img of thumbImages; let i=index">
          <div class="float-left view-more" *ngIf="i<=4">
            <span *ngIf="i==4 && thumbImages.length > 5">
              <a class="more" (click)="OpenImageModel(img.img,thumbImages)"> 
                +{{thumbImages.length - 5}} more
              </a>
              <span class="overlay"></span>
            </span>
            <img class="list-img" src="{{img.thumb}}" (click)="OpenImageModel(img.img,thumbImages)"
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
          <a *ngIf="!liked" (click)="like()">
            <img src="/assets/img/event/detail/icon-like.png" alt="icon-like">
          </a>
          <a *ngIf="liked" (click)="unLike()">
            <img src="/assets/img/event/detail/icon-liked.png" alt="icon-like" width="24" height="23">
          </a>
          <a>
            {{likeNumber}} Likes
          </a>
        </div>
        <div class="comments-area">
          <a>
            <img src="/assets/img/event/detail/icon-comment.png" alt="icon-comment">
          </a>
          <a>
            {{comments.length}} Comments
          </a>
        </div>
        <div class="report-area">
          <a>
            <img src="/assets/img/event/detail/icon-report.png" alt="icon-report">
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
        <li *ngFor="let comment of comments">
          <app-comment [comment]="comment">
          </app-comment>
        </li>
      </ul>

      <div class="view-more-comments clearfix" *ngIf="comments.length > 2">
        <a class="button-view-more-comments" (click)="addComments()">View more comments</a>
        <span class="count-comments">2 of 5</span>
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

  public currentUser: User;
  public user: User;
  public rating: number;
  public date: Date;
  public text: string;
  public images: string[];
  public thumbImages: any[] = [];
  public comments: HyloComment[];
  public likeNumber: number;
  public liked: boolean;

  constructor(private event: EventDetailComponent) {
  }

  public ngOnInit() {
    this.currentUser = this.event.user;
    this.user = this.experience.user;
    this.rating = this.experience.rating;
    this.date = this.experience.date;
    this.text = this.experience.text;
    this.images = this.experience.images;
    this.comments = this.experience.comments;
    this.likeNumber = this.experience.likeNumber;
    this.liked = this.experience.liked;

    for (let i of this.images) {
      this.thumbImages.push(
        {
          thumb: i,
          img: i,
          description: 'Thumb Image'
        }
      );
    }
  }

  public addComment(msgInput) {
    let comment: HyloComment = {
      user: this.event.user,
      text: msgInput.value,
      likeNumber: 0,
      liked: false,
      replies: []
    };
    this.comments.push(comment);
    msgInput.value = '';
  }

  public addComments(comments: HyloComment[]) {
    // TODO: add comments
    // load comments by calling comment API
    // variable: experience.comments
    comments = this.getComments(this.comments.length, 2);
    for (let comment of comments) {
      this.comments.push(comment);
    }
  }

  public getComments(start: number, range: number): HyloComment[] {
    return this.event.eventService.getComments(start, range);
  }

  public OpenImageModel(imageSrc, images) {
    let imageModalPointer;
    for (let i = 0; i < images.length; i++) {
      if (imageSrc === images[i].img) {
        imageModalPointer = i;
        console.log('========> ', i);
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

  public like() {
    this.liked = true;
    this.likeNumber += 1;
  }

  public unLike() {
    this.liked = false;
    this.likeNumber -= 1;
  }
}
