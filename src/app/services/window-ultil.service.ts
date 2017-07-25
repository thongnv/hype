import { Injectable, NgZone } from '@angular/core';

function getWindow (): any {
  return window;
}

@Injectable()
export class WindowUtilService {
  // global variables
  public rootContainer = {
    width: 0,
    height: 0,
    innerWidth: 0,
  };

  constructor(zone: NgZone) {
    window.addEventListener('resize', event => {
      zone.run(() => {
        this.rootContainer.innerWidth = window.innerWidth;
      });
    });
  }

  get nativeWindow (): any {
    return getWindow();
  }

}
