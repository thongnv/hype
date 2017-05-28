import { Component, OnInit, Input } from '@angular/core';

import { HyloComment, User, Experience } from '../../app.interface';
import { EventDetailComponent } from './detail.component';

@Component({
  selector: 'event-experience',
  template: `
    <div class="row">
      <div class="col-md-2">
        <img [src]="user.avatar" class="user-avatar">
      </div>
      <div class="col-md-6">
        <p>{{user.firstName + ' ' + user.lastName}}</p>
        <div>
          <div>{{date}}</div>
        </div>
      </div>
      <div class="col-md-4">
          <span *ngFor="let i of rating | myArray">
            <i fa [name]="'star'" [size]=1></i>
          </span>
        <span *ngFor="let i of 5 - rating | myArray">
            <i fa [name]="'star-o'" [size]=1></i>
          </span>
      </div>
    </div>
    <div>
      <p>{{text}}</p>
    </div>
    <span *ngFor="let image of images">
        <img [src]="image" style="width: 100px; height: 100px">
      </span>

    <div class="row">
      <div class="col-md-2">
        <i fa [name]="'thumbs-o-up'" [size]=1></i> <span>{{likeNumber}}</span> Likes
      </div>
      <div class="col-md-8">
        <i fa [name]="'comment-o'" [size]=1></i> <span>{{comments.length}}</span> Comments
      </div>
      <div class="col-md-2 align-right">
        Report
      </div>
    </div>

    <hr>

    <div class="row comment">
      <div class="col-md-2">
        <img class="user-avatar-small" [src]="user.avatar">
      </div>
      <textarea class="col-md-9" #msgInput placeholder="Write your comment" (keydown.enter)="addComment(msgInput);false"></textarea>
    </div>

    <app-comment class="row comment" *ngFor="let comment of comments"
                 [comment]="comment">
    </app-comment>
    
    <div *ngIf="comments.length > 2">
      <a (click)="addComments()">View more comments</a> 
    </div>

    <hr>

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
