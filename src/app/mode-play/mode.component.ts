import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap'
import {ModeService} from "../services/mode.service";
import "rxjs/Rx";

@Component({
    moduleId: "hylo-mode",
    selector: 'app-mode',
    templateUrl: './mode.component.html',
    styleUrls: ['./mode.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [NgbRatingConfig]
})


export class ModeComponent implements OnInit {

    public data:any;
    public categories:any = [];
    public someValue:number = 5;
    public someRange3:number[] = [50, 300];
    public filterFromMode:FormGroup;
    public filterCategory:FormGroup;
    params:{type:string} = {type: 'eat'};
    public items = [];
    public filterData:any = [];
    public currentRate = 3;

    public constructor(private formBuilder:FormBuilder, private modeService:ModeService, private rateComfig:NgbRatingConfig) {

        this.filterFromMode = this.formBuilder.group({
            filterMode: 'all'
        });

        this.filterCategory = this.formBuilder.group({
            filterCategory: 'all'
        });

        this.rateComfig.max = 5;
        this.rateComfig.readonly = false;
    }

    public ngOnInit() {
        this.data = {lat: 1.390570, lng: 103.351923};
        this.getCategories();
        this.getDataModes();
        this.getFilter();
    }

    onChange(value:number) {
        this.someValue = this.someValue + value;
    }

    getDataModes() {
        this.modeService.getModes(this.params).map(response => response.json())
            .subscribe(data => this.items = data);
    }

    getCategories() {
        if (this.filterFromMode.getRawValue().filterMode == 'all') {
            this.params.type = 'eat';
        }
        else {
            this.params.type = this.filterFromMode.getRawValue().filterMode;
        }
        console.log(this.params);
        this.modeService.getCategories(this.params).map(resp=>resp.json()).subscribe((resp)=> {
            this.categories = resp;
        });
    }

    getFilter() {
        this.modeService.getFilterMode().map(resp=>resp.json()).subscribe((resp)=> {
            this.filterData = resp;
        });
    }

    filterCancel() {

    }

    filterSubmit() {
        this.getDataModes();
    }


}