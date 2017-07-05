import { Injectable, Output, EventEmitter } from '@angular/core';
import { BaseUser } from '../app.interface';

@Injectable()
export class ProfileService {
  @Output() public profileChange: EventEmitter<any> = new EventEmitter();

  public change(data: BaseUser) {
    this.profileChange.emit(data);
  }

  public getEmittedValue() {
    return this.profileChange;
  }

}
