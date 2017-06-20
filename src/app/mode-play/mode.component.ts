import { Component, OnInit,ViewEncapsulation,NgZone,AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap'
import {ModeService} from "../services/mode.service";
import {GoogleMapsAPIWrapper} from "angular2-google-maps/core/services/google-maps-api-wrapper";
import {MapsAPILoader} from "angular2-google-maps/core/services/maps-api-loader/maps-api-loader";
import {LoaderService} from "../shared/loader/loader.service";
import { Ng2ScrollableDirective } from 'ng2-scrollable';
import { scrollTo } from 'ng2-utils';

declare let google:any;

@Component({
    moduleId: "hylo-mode",
    selector: 'app-mode',
    templateUrl: './mode.component.html',
    styleUrls: ['./mode.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [NgbRatingConfig]
})


export class ModeComponent implements OnInit {
    public markers:any = [];
    public categories:any = [];
    public categoriesDraw:any[];
    public someValue:number = 5;
    public priceRange:number[] = [0, 300];
    public filterFromMode:FormGroup;
    public filterCategory:FormGroup;
    public items = [];
    public filterData:any = [];
    public currentHighlightedMarker:number = 1;
    public currentRate = 0;
    public mode:any = {};
    public cuisine:any[] = [{}];
    public best:any[] = [{}];
    public latlngBounds:any;
    public mapZoom:number = 15;
    public lat:number = 1.3089757786697331;
    public lng:number = 103.8258969783783;
    public currentRadius:any = 3000;
    private catParam = {mode_type: ''};
    public showMap:boolean = false;
    private total:number = 0;
    public showAll:boolean = true;
    public showTab:boolean = true;
    public alertType:any = '';
    public msgContent:any = '';
    private params = {
        type: 'all',
        kind: '',
        price: '',
        activity: ["education"],
        cuisine: '',
        rate: 0,
        bestfor: '',
        order_by: 'Company_Name',
        order_dir: 'ASC',
        lat: 1.352083,
        long: 103.819836,
        radius: 50,
        page: 0,
        limit: 20
    };

    public constructor(private formBuilder:FormBuilder,
                       private modeService:ModeService,
                       private rateConfig:NgbRatingConfig,
                       private wrapper:GoogleMapsAPIWrapper,
                       private mapsAPILoader:MapsAPILoader,
                       private loaderService:LoaderService) {

        this.filterFromMode = this.formBuilder.group({
            filterMode: 'all'
        });

        this.filterCategory = this.formBuilder.group({
            filterCategory: 'all'
        });

        this.rateConfig.max = 5;
        this.rateConfig.readonly = false;
        this.loaderService.show();
    }

    public ngOnInit() {
        this.getCategories(this.filterFromMode.value.filterMode);
        this.getDataModes();
        this.getFilter();
        // this.renderMaker(5000);
    }

    onChange(value:number) {
        this.someValue = this.someValue + value;
    }

    getDataModes() {
        let params = this.params;
        console.log(params);
        this.modeService.getModes(params).map(resp=>resp.json()).subscribe((resp)=> {
            console.log(resp);
            if (parseInt(resp.total) > 0) {
                this.showMap = true;
            }
            this.loaderService.hide();
            this.total = resp.total;
            this.items = resp.company;
            this.initMap(resp.company);
        }, err=> {
            this.items = [];
            this.markers = [];
            this.loaderService.hide();
        });
    }

    changeCategory() {
        this.loaderService.show();
        this.params.kind = this.filterCategory.value.filterMode;
        this.getDataModes();
    }

    getCategories(value) {
        if (value == 'play' || value == 'eat') {
            this.catParam.mode_type = 'mode_' + value;
        } else {
            this.catParam.mode_type = '';
        }
        let params = this.catParam;
        this.modeService.getCategories(params).map(resp=>resp.json()).subscribe((resp)=> {
            this.categoriesDraw = resp.data;
            this.categories = resp.data.slice(0, 6);
        });

    }

    getFilter() {
        this.modeService.getFilterMode().map(resp=>resp.json()).subscribe((resp)=> {
            this.filterData = resp;
        });
    }


    markerDragEnd($event) {
        if ($event.coords) {
            console.log('dragEnd', $event);
            //Update center map
            this.lat = $event.coords.lat;
            this.lng = $event.coords.lng;
        }
    }

    markerRadiusChange(event) {
        console.log("Radius Change", event);
        let radius = parseInt(event);
        //this.renderMaker();
    }

    mapClicked($event) {
        if ($event.coords) {
            console.log({
                latitude: $event.coords.lat,
                longitude: $event.coords.lng,
            });
            this.markers.push({
                lat: $event.coords.lat,
                lng: $event.coords.lng,
                draggable: false
            });
        }
    }

    changeType() {
        this.params.type = this.filterFromMode.value.filterMode;
        this.params.kind = '';
        this.getCategories(this.filterFromMode.value.filterMode);
        this.loaderService.show();
        this.getDataModes();

    }

    private initMap(companies:any) {
        if (this.items) {
            for (let i = 0; i < this.items.length; i++) {
                if (typeof this.items[i].YP_Address !== 'undefined' || this.items[i].YP_Address !== null) {
                    let lat = this.items[i].YP_Address[6].split("/");
                    let lng = this.items[i].YP_Address[5].split("/");
                    this.markers.push({
                        lat: parseFloat(lat[1]),
                        lng: parseFloat(lng[1]),
                        label: this.items[i].Company_Name,
                        opacity: 0.6,
                        isOpenInfo: false
                    });
                }
            }
        }

    }

    public clickedMarker(selector, horizontal) {
        scrollTo(
            '#v' + selector,
            '#v-scrollable',
            horizontal,
            0
        );

    }

    public onScroll(event) {
        let elm = event.srcElement;
        let baseHeight = event.target.clientHeight;
        let realScrollTop = event.target.scrollTop + baseHeight;
        let currentHeight:number = baseHeight;

        // determine just scrolled to end
        if (elm.clientHeight + elm.scrollTop + elm.clientTop === elm.scrollHeight) {
            console.log('end, params: ', this.params);
            this.markers = [];
            this.params.page += 1;
            this.loaderService.show();
            this.getDataModes();
        }

        if (event.target.children[0].children.length > 1) {
            for (let i = 0; i < event.target.children[0].children.length; i++) {
                let currentClientH = event.target.children[0].children[i].clientHeight;
                currentHeight += currentClientH;
                if (currentHeight - currentClientH <= realScrollTop && realScrollTop <= currentHeight) {
                    if (this.currentHighlightedMarker !== i) {
                        this.currentHighlightedMarker = i;
                        this.highlightMarker(i);
                    }
                }
            }
        }
    }

    private highlightMarker(markerId:number):void {
        if (this.markers[markerId]) {
            this.markers.forEach((marker, index) => {
                if (index === markerId) {
                    this.markers[index].opacity = 1;
                    this.markers[index].isOpenInfo = true;
                } else {
                    this.markers[index].opacity = 0.4;
                    this.markers[index].isOpenInfo = false;
                }
            });
        }

    }

    filterSubmit() {
        let cuisine = new Array();
        let best = new Array();
        Object.keys(this.cuisine).map(function (k) {
            if (k !== '0') {
                cuisine.push(k);
            }
        });
        Object.keys(this.cuisine).map(function (k) {
            if (k !== '0') {
                best.push(k);
            }
        });
        console.log(cuisine);
        this.params.price = this.priceRange.join(',');
        this.params.cuisine = cuisine.join(',');
        this.params.bestfor = best.join(',');
        this.params.rate = this.currentRate;
        this.loaderService.show();
        this.getDataModes();
    }

    public filterCancel() {
        this.currentRate = 0;
        this.priceRange = [0, 50]
        this.cuisine = [];
        this.best = [];
        this.filterFromMode.value.filterMode = 'all';
        this.filterCategory.value.filterCategory = 'all';
        this.params.price = '';
        this.params.rate = 0;
        this.params.cuisine = '';
        this.params.bestfor = '';
        this.loaderService.show();
        this.getDataModes();


    }

    trackByIndex(index:number, obj:any):any {
        return index;
    }

    showAllKind(e) {
        if (e) {
            this.categories = this.categoriesDraw;
            this.showAll = false;
        } else {
            this.categories = this.categories.slice(0, 6);
            this.showAll = true;
        }
    }

    onLikeEmit(item:any) {
        console.log(item);
        item.is_favorite = !item.is_favorite;
        let params = {
            ids_no: item.Ids_No
        }
        this.loaderService.show();
        this.modeService.favoritePlace(params).map(res=>res.json()).subscribe(res=> {
            this.alertType = 'success';
            this.msgContent = res.message;

            this.loaderService.hide();
        }, err=> {
            this.alertType = 'error';
            this.msgContent = 'Sorry, favorite error please try again';
            this.loaderService.hide();
            console.log(err);
        });
    }

    showAllType(e) {
        if (e) {
            this.showTab = false;
        } else {
            this.showTab = true;
        }
    }

    public showPrice:boolean = false;
    public showCuisine:boolean = false;
    public showRate:boolean = false;
    public showBest:boolean = false;
    public showType:boolean = false;

    showRagePriceFind(e) {
        if (e) {
            this.showPrice = false;
        } else {
            this.showPrice = true;
        }
        this.showCuisine=false;
        this.showRate=false;
        this.showBest=false;
        this.showType=false;
    }

    showCuisineFind(e) {
        if (e) {
            this.showCuisine = false;
        } else {
            this.showCuisine = true;
        }
        this.showPrice=false;
        this.showRate=false;
        this.showBest=false;
        this.showType=false;
    }
    showRateFind(e) {
        if (e) {
            this.showRate = false;
        } else {
            this.showRate = true;
        }

        this.showPrice=false;
        this.showCuisine=false;
        this.showBest=false;
        this.showType=false;
    }


    showBestFind(e) {
        if (e) {
            this.showBest = false;
        } else {
            this.showBest = true;
        }

        this.showPrice=false;
        this.showCuisine=false;
        this.showRate=false;
        this.showType=false;

    }
    showTypeFind(e) {
        if (e) {
            this.showType = false;
        } else {
            this.showType = true;
        }
        this.showPrice=false;
        this.showCuisine=false;
        this.showRate=false;
        this.showBest=false;
    }
}