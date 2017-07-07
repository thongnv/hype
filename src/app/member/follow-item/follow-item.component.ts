import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-follow-item',
  templateUrl: './follow-item.component.html',
  styleUrls: ['./follow-item.component.css'],
})
export class FollowItemComponent implements OnInit {

  @Input() public item: any;

  @Output() public onUpdate = new EventEmitter<any>();

  constructor(private userService: UserService) {
  }

  public ngOnInit() {
    this.item.followed = this.item.flag === 1;
  }

  public toggleFollow(): void {
    this.userService.toggleFollow(this.item.id).subscribe(
      (resp) => {
        if (resp.status) {
          this.item.followed = !this.item.followed;
          this.onUpdate.emit(this.item);
        }
    });
  }
}
