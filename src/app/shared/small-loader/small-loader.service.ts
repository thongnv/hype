import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { SmallLoaderState } from '../../app.interface';

@Injectable()

export class SmallLoaderService {

  public loaderSubject = new Subject<SmallLoaderState>();

  public loaderState = this.loaderSubject.asObservable();

  constructor() {
    // TODO
  }

  public show() {
    this.loaderSubject.next(<SmallLoaderState> {loading: true});
  }

  public hide() {
    this.loaderSubject.next(<SmallLoaderState> {loading: false});
  }
}
