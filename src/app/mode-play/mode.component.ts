import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {CategoryService} from "../services/category.service";

@Component({
    moduleId: "hylo-mode",
    selector: 'app-mode',
    templateUrl: './mode.component.html',
    styleUrls: ['./mode.component.css'],
})


export class ModeComponent implements OnInit {
    public data:any;
    public categories:any = [];
    public someValue:number = 5;
    public someRange3:number[] = [2, 8];
    public filterFromMode:FormGroup;
    public filterCategory:FormGroup;
    params:{type:string} = {type: 'eat'};

    public constructor(private formBuilder:FormBuilder, private categoryService:CategoryService) {

        this.filterFromMode = this.formBuilder.group({
            filterMode: 'all'
        });

        this.filterCategory = this.formBuilder.group({
            filterCategory: 'all'
        });

    }

    public ngOnInit() {
        this.data = {lat: 1.390570, lng: 103.351923};
        this.getCategories();
    }


    onChange(value:number) {
        this.someValue = this.someValue + value;
    }

    getCategories() {
        if (this.filterFromMode.getRawValue().filterMode == 'all') {
            this.params.type = 'eat';
        }
        else {
            this.params.type = this.filterFromMode.getRawValue().filterMode;
        }
        console.log(this.params);
        this.categoryService.getCategories(this.params).map(resp=>resp.json()).subscribe((resp)=> {
            this.categories = resp;
        });
    }

}