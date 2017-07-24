import { Injectable } from '@angular/core';

function getWindow (): any {
  return window;
}

@Injectable()
export class WindowUtilService {
  // global variables
  public rootContainer = {
    width: 0,
    height: 0,
  };

  constructor() {
    // TODO
  }

  get nativeWindow (): any {
    return getWindow();
  }

}
