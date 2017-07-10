import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class FollowService {

  @Output() public followStateChange: EventEmitter<any> = new EventEmitter();

  public change(user, followed) {
    this.followStateChange.emit({user, followed});
  }

  public getEmittedValue() {
    return this.followStateChange;
  }

}
