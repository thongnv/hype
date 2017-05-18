import { Component, Input } from '@angular/core';
import { MainService } from '../../services/main.service';

@Component({
    selector: 'app-interest-item',
    templateUrl: './interest-item.component.html',
    styleUrls: ['./interest-item.component.css']
})
export class InterestItemComponent {
    @Input('item') public item: any;

    public constructor(private mainService: MainService) {
    }

    public onSelect(item: any): void {
        item.bookmark = (item.bookmark) ? false : true;
    }
}
