import { Component, OnInit, Input } from '@angular/core';

import { HyloComment, User } from '../../app.interface';

@Component({
  selector: 'app-comment',
  template: `
    <div class="col-md-2">
      <img class="user-avatar-small" [src]="user.avatar">
    </div>
    <div class="col-md-9">
      <span style="font-weight: bold" [innerHTML]="user.firstName + ' ' + user.lastName"></span>
      <span [innerHTML]="text"></span>
    </div>
  `,
  styleUrls: ['./detail.component.css']
})
export class CommentComponent implements HyloComment, OnInit {
  @Input() public comment: HyloComment;

  public likeNumber: number;
  public replies: HyloComment[];
  public user: User;
  public text: string;

  constructor() {
  }

  public ngOnInit() {
    this.likeNumber = this.comment.likeNumber;
    this.replies = this.comment.replies;
    this.user = this.comment.user;
    this.text = this.comment.text;
  }
}
