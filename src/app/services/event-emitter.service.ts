import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EventEmitterService {
  dataStream = new EventEmitter();

  constructor() { }

  sendMessage(data: string) {
    this.dataStream.emit(data);
  }

}
