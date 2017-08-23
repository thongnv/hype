import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EventEmitterService {
  dataStream = new EventEmitter();

  constructor() { }

  sendMessage(data: string) {
    console.log('emit data: ', data);
    this.dataStream.emit(data);
  }

}
