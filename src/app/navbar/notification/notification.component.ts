import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})

export class NotificationComponent {
  @Input('notifications') public notifications: any;
  @Input('onNotify') public onNotify: boolean;
  @Input('loadingInProgress') public loadingInProgress: boolean;
  @Input('endOfList') public endOfList: boolean;
  @Output('onMarkAllRead') public onMarkAllRead = new EventEmitter<any>();
  @Output('onMarkOneRead') public onMarkOneRead = new EventEmitter<any>();
  @Output('onScrollToBottom') public onScrollToBottom = new EventEmitter<any>();
  @Output('onClickNotify') public onClickNotify = new EventEmitter<any>();

  constructor(){
    console.log(this.onNotify);
  }
  public onClickMarkAll() {
    this.onMarkAllRead.emit(null);
  }

  public onClickItem(item: any) {
    console.log(item);
    this.onMarkOneRead.emit(item);
  }
  public notifyClick(event){
    console.log(event);
    this.onClickNotify.emit(event);
    this.onNotify= !this.onNotify;
  }
  public onScrollDown(event) {
    let elm = event.srcElement;
    if (elm.clientHeight + elm.scrollTop === elm.scrollHeight) {
      this.onScrollToBottom.emit(null);
    }
  }
}
