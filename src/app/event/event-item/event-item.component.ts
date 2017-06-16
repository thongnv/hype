import { Component, EventEmitter, Input, Output,ViewChild,ViewEncapsulation } from '@angular/core';
import {Ng2PopupComponent,Ng2MessagePopupComponent} from "ng2-popup/dist/index";

@Component({
    selector: 'app-event-item',
    templateUrl: './event-item.component.html',
    styleUrls: ['./event-item.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class EventItemComponent {

    @ViewChild(Ng2PopupComponent) popup:Ng2PopupComponent;
    @Input('events') public events:any;

    @Output('onClickLike') public onClickLike = new EventEmitter<any>();

    @Output('onClickMention') public onClickMention = new EventEmitter<any>();

    private message:string;

    public onLikeEmit(item:any) {
        this.onClickLike.emit(item);
    }

    // Properties
    public itemsPerPage = 5;
    public currentNumberItems = this.itemsPerPage;
    public showEndOfList = false;

    // Methods
    public loadMore() {
        this.currentNumberItems += this.itemsPerPage;
        if (this.currentNumberItems >= this.events.length) {
            this.showEndOfList = true;
        }
    }

    public openPopupMention(e) {
        this.popup.open(Ng2MessagePopupComponent, {
            classNames: 'popup_mention',
            title: "Demo",
            message: "This is message given using popup.open()",
            buttons: {
                OK: () => {
                    this.message = "Ok button is pressed";
                },
                CANCEL: () => {
                    this.message = "Cancel button is pressed";
                    this.popup.close();
                }
            }
        });
    }
}
