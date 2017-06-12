import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})

export class NotificationComponent {
  @Input('notifications') public notifications: any;
  @Input('loadingInProgress') public loadingInProgress: boolean;
  @Input('endOfList') public endOfList: boolean;
  @Output('onMarkAllRead') public onMarkAllRead = new EventEmitter<any>();
  @Output('onMarkOneRead') public onMarkOneRead = new EventEmitter<any>();
  @Output('onScrollToBottom') public onScrollToBottom = new EventEmitter<any>();

  public onClickMarkAll() {
    this.onMarkAllRead.emit(null);
  }

  public onClickItem(item: any) {
    this.onMarkOneRead.emit(item);
  }

  public onScrollDown(event) {
    let elm = event.srcElement;
    if (elm.clientHeight + elm.scrollTop === elm.scrollHeight) {
      this.onScrollToBottom.emit(null);
    }
  }
}
