import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { LoaderState } from '../../app.interface';

@Injectable()

export class LoaderService {

  public loaderSubject = new Subject<LoaderState>();

  public loaderState = this.loaderSubject.asObservable();

  constructor() {
    // TODO
  }

  public show() {
    this.loaderSubject.next(<LoaderState> {show: true});
  }

  public hide() {
    this.loaderSubject.next(<LoaderState> {show: false});
  }
}
