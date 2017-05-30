import { Component, OnInit, Input } from '@angular/core';

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
            {{date}}
          </p>
        </div>
        <ul class="list-stars-review-experience">
          <li *ngFor="let i of rating | myArray"><a>
            <img src="/assets/img/eventdetailpage/small-star-selected.png"
                 alt="small-star-selected"></a>
          </li>

          <li *ngFor="let i of 5 - rating | myArray"><a>
            <img src="/assets/img/eventdetailpage/small-star.png"
                 alt="small-star"></a></li>
        </ul>
      </div>
      <p class="detail-info-experience clearfix">
        {{text}}
      </p>
      <ul class="list-pictures-experience">
        <li *ngFor="let image of images">
          <a><img [src]="image" alt="" width="100" height="100"></a>
        </li>
      </ul>

      <div class="likes-comments-experience-area clearfix">
        <div class="likes-area">
          <a>
            <img src="/assets/img/eventdetailpage/icon-like.png" alt="icon-like">
          </a>
          <a href="#">
            {{likeNumber}} Likes
          </a>
        </div>
        <div class="comments-area">
          <a href="#">
            <img src="/assets/img/eventdetailpage/icon-comment.png" alt="icon-comment">
          </a>
          <a href="#">
            {{comments.length}} Comments
          </a>
        </div>
        <div class="report-area">
          <a href="#">
            <img src="/assets/img/eventdetailpage/icon-report.png" alt="icon-report">
          </a>
          <a href="#">
            Report
          </a>
        </div>
      </div>

    </div>

    <!-- write your comment start -->
    <div class="write-your-comment border-bottom padding-top-30 padding-bottom-35">

      <div class="write-comment-area">
        <img class="img-circle" [src]="user.avatar" alt="user avatar" width="50" height="50">
        <textarea #msgInput placeholder="Write your comment"
                  (keydown.enter)="addComment(msgInput);false"></textarea>
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
  public user: User;
  public rating: number;
  public date: string;
  public text: string;
  public images: string[];
  public comments: HyloComment[];
  public likeNumber: number;

  constructor(private event: EventDetailComponent) {
  }

  public ngOnInit() {
    this.user = this.experience.user;
    this.rating = this.experience.rating;
    this.date = this.experience.date;
    this.text = this.experience.text;
    this.images = this.experience.images;
    this.comments = this.experience.comments;
    this.likeNumber = this.experience.likeNumber;
  }

  public addComment(msgInput) {
    let comment: HyloComment = {
      user: this.event.user,
      text: msgInput.value,
      likeNumber: 0,
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
}
