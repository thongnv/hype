import { Component, OnInit, Input } from '@angular/core';

import { HyloComment, User } from '../../app.interface';

@Component({
  selector: 'app-comment',
  template: `
    <div class="avatar-comment-ago">
      <a>
        <img class="img-circle" [src]="user.avatar" alt="user avatar" width="50"
             height="50">
      </a>
    </div>

    <div class="content-comment-ago">
      <div class="top-content-comment">
        <a><b>{{user.firstName + ' ' + user.lastName}}</b></a>
        <span [innerHTML]="text"></span>
      </div>
      <div class="bottom-like-reply-comment">
        <div class="likes-area">
          <a>
            <img src="/assets/img/event/detail/icon-like.png" alt="icon-like">
          </a>
          <a>
            Likes
          </a>
        </div>
        <div class="reply-area">
          <a>
            <img src="/assets/img/event/detail/icon-reply.png" alt="icon-reply">
          </a>
          <a>
            Reply
          </a>
        </div>

      </div>
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
  public liked: boolean;

  constructor() {
    // TODO
  }

  public ngOnInit() {
    this.likeNumber = this.comment.likeNumber;
    this.replies = this.comment.replies;
    this.user = this.comment.user;
    this.text = this.comment.text;
    this.liked = this.comment.liked;
  }
}
