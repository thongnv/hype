import { Component, EventEmitter, Input,Output,ViewChild,ViewEncapsulation} from '@angular/core';


@Component({
    selector: 'app-event-item',
    templateUrl: './event-item.component.html',
    styleUrls: ['./event-item.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class EventItemComponent {

    @Input('events') public events:any;

    @Output('onClickLike') public onClickLike = new EventEmitter<any>();

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

}
