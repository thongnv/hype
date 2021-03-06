import { Component, OnInit, Input } from '@angular/core';

import { BaseUser, HyloComment } from '../../app.interface';
import { EventService } from '../../services/event.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment',
  template: `
    <div class="avatar-comment-ago">
      <a>
        <img class="img-circle" [src]="author.avatar" alt="user avatar" width="50"
             height="50">
      </a>
    </div>

    <div class="content-comment-ago">
      <div class="top-content-comment">
        <a><b>{{author.name}}</b></a>
        <span [innerHTML]="text"></span>
      </div>
      <div class="bottom-like-reply-comment">
        <div class="likes-area">
          <a (click)="toggleLike()">
            <span *ngIf="!liked">Like</span>
            <span *ngIf="liked" class="liked">Liked</span>
          </a>
        </div>
        <div class="reply-area">
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

  public id: number;
  public pid: number;
  public likeNumber: number;
  public replies: HyloComment[];
  public author: BaseUser;
  public text: string;
  public liked: boolean;
  public clickedLike = false;

  constructor(private localStorageService: LocalStorageService,
              private eventService: EventService,
              private router: Router) {
  }

  public ngOnInit() {
    this.id = this.comment.id;
    this.pid = this.comment.pid;
    this.likeNumber = this.comment.likeNumber;
    this.replies = this.comment.replies;
    this.author = this.comment.author;
    this.text = this.comment.text;
    this.liked = this.comment.liked;
  }

  public toggleLike() {
    if (!this.localStorageService.get('user')) {
      this.router.navigate(['login']).then();
      return;
    }
    if (!this.clickedLike) {
      this.clickedLike = true;
      this.liked = !this.liked;
      this.eventService.toggleLike(this.pid, this.id, this.liked).subscribe(
        (resp) => {
          console.log(resp);
          this.clickedLike = false;
        },
        (error) => {
          console.log(error);
          this.clickedLike = false;
          this.liked = !this.liked;
        }
      );
    }

  }
}
