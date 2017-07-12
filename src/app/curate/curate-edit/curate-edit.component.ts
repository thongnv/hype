import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { MainService } from '../../services/main.service';
import { LoaderService } from '../../helper/loader/loader.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-curate-edit',
    templateUrl: './curate-edit.component.html',
    styleUrls: ['./curate-edit.component.css']
})

export class CurateEditComponent implements OnInit {
    public favorite:any;
    public categories:any[];
    public previewUrl:any[] = [];
    public listPlaces:any[] = [];
    public markers:any[] = [];
    public showPreview:boolean = false;
    public addImage:boolean = true;
    public submitted:boolean = false;
    public validCaptcha:boolean = false;

    public NextPhotoInterval:number = 5000;
    public noLoopSlides:boolean = false;
    public noTransition:boolean = false;
    public slides:any[] = [];
    public previewData:any;
    public lat:number = 1.290270;
    public lng:number = 103.851959;
    public zoom:number = 12;
    public article:any[] = [];
    public contentControl:any;
    public category:any;
    private slugName:any;

    public currentHighlightedMarker:number = null;
    public formData = this.formBuilder.group({
        listName: ['', Validators.required],
        listDescription: ['', Validators.required],
        listCategory: ['', Validators.required],
        listImages: [''],
        listPlaces: this.formBuilder.array([])
    });

    constructor(public formBuilder:FormBuilder,
                private mainService:MainService,
                private userService:UserService,
                public sanitizer:DomSanitizer,
                private loaderService:LoaderService,
                private route:ActivatedRoute,
                private router:Router) {
        //this.onAddPlace();
    }

    public ngOnInit() {
        this.loaderService.show();
        this.userService.checkLogin().subscribe(
            (response:any) => {
                if (response === 0) {
                    this.router.navigate(['/login'], {skipLocationChange: true}).then();
                }
            }
        );
        this.mainService.getCategoryArticle().subscribe(
            (response:any) => {
                this.categories = response.data;
                this.loaderService.hide();
            }
        );

        this.route.params.subscribe((e) => {
            this.slugName = e.slug;
            this.loaderService.show();
            this.mainService.getDetail('article', this.slugName).subscribe((res)=> {
                this.article = res;
                this.contentControl = res.body;
                this.category = res.field_category.tid;
                const control = <FormArray> this.formData.controls['listPlaces'];
                for (let place of res.field_places) {
                    if(place.field_latitude) {
                        const placeCtrl = this.initPlaces(place);
                        control.push(placeCtrl);
                    }
                }

            });
        });
    }

    public onAddPlace() {
        const control = <FormArray> this.formData.controls['listPlaces'];
        const placeCtrl = this.initAddress();
        control.push(placeCtrl);
    }

    public removeAddress(i:number) {
        const control = <FormArray> this.formData.controls['listPlaces'];
        control.removeAt(i);
    }

    public onRemovePreview(imageUrl) {
        let imageId = this.previewUrl.indexOf(imageUrl);
        delete this.previewUrl[imageId];
        this.previewUrl = this.previewUrl.filter((img) => img !== imageUrl);
        if ((this.previewUrl.length + this.previewUrl.length) < 5) {
            this.addImage = true;
        }
    }

    public onRemoveImage(imageUrl) {
        let imageId = this.article.field_images.indexOf(imageUrl);
        if (imageId != -1) {
            this.article.field_images.splice(imageId, 1);
            if ((this.article.field_images + this.previewUrl.length) < 5) {
                this.addImage = true;
            }
        }
    }

    public readUrl(event) {
        let reader = [];
        if (event.target.files && event.target.files[0] && this.previewUrl.length < 5) {
            let typeFile = new RegExp(`^img\/\w+`);
            for (let i = 0; i < event.target.files.length && i < 5; i++) {
                if (true) {
                    reader[i] = new FileReader();
                    reader[i].onload = (e) => {
                        let image = new Image();
                        image.src = e.target.result;

                        this.resizeImage(image, 680, 360, (resizedImage) => {
                            let img = {
                                url: resizedImage,
                                value: e.target.result.replace(/^data:image\/\S+;base64,/, ''),
                                filename: event.target.files[i].name,
                                filemime: event.target.files[i].type
                            };
                            this.previewUrl.push(img);

                            if (this.previewUrl.length >= 5) {
                                this.addImage = false;
                            }
                        });
                    };
                    reader[i].readAsDataURL(event.target.files[i]);
                }
            }
        }
    }

    public onSubmit() {
        if (this.formData.valid) {
            let article = this.formData.value;
            this.listPlaces = [];
            let address = article.listPlaces;
            console.log(address);
            for (let add of address) {
                this.listPlaces.push({
                    field_place_comment: add.description,
                    field_latitude: add.lat,
                    field_longitude: add.lng,
                    field_slug: add.slug,
                    field_place_address: add.keyword,
                    field_place_images: [add.image],
                });
            }
            article.listPlaces = this.listPlaces;
            article.listImages = this.previewUrl;
            let data = this.mapArticle(article);
            this.loaderService.show();
            if (!this.submitted) {
                this.mainService.postArticle(data).subscribe(
                    (response) => {
                        if (response.status) {
                            this.loaderService.hide();
                            this.submitted = false;
                            this.router.navigate([response.data.slug]);
                        }
                    }
                );
            }
        } else {
            this.formData.markAsTouched();
        }
    }

    public onPreview() {
        console.log(this.formData.value);
        this.previewData = this.formData.value;
        this.previewData.images = this.previewUrl;
        this.initMap();
    }

    public checkCaptcha(captcha) {
        if (captcha) {
            this.validCaptcha = true;
        }
    }

    public switchView(status:boolean) {
        this.showPreview = status;
        if (status) {
            console.log(this.formData.value);
            this.previewData = this.formData.value;
            this.previewData.images = this.previewUrl;
            this.initMap();
        }
    }

    public onScroll(event) {
        let baseHeight = event.target.clientHeight;
        let realScrollTop = event.target.scrollTop + baseHeight;
        let currentHeight:number = baseHeight;

        if (event.target.children.length > 1) {
            for (let i = 0; i < event.target.children.length; i++) {
                let currentClientH = event.target.children[i].clientHeight;
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

    public mapArticle(article) {
        return {
            title: article.listName,
            body: article.listDescription,
            field_images: article.listImages,
            category: article.listCategory,
            field_places: article.listPlaces
        };
    }

    public onMapsChangePlace(data, i) {
        // get lat long from place id
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({placeId: data.place_id}, (results, status) => {
            if (status.toString() === 'OK') {
                // set lat long for eventPlace
                let placeControl = this.formData.get('listPlaces') as FormArray;
                let place = placeControl.at(i);
                place.patchValue({
                    keyword: data.structured_formatting.main_text,
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng(),
                    slug: '',
                });
            }
        });
    }

    public onHyloChangePlace(data, i) {
        // let control = this.formData.get('listPlaces').controls[i] as FormGroup;
        let placeControl = this.formData.get('listPlaces') as FormArray;
        let place = placeControl.at(i);
        place.patchValue({
            keyword: data.Title,
            lat: Number(data.Lat),
            lng: Number(data.Long),
            slug: data.Slug,
        });
    }

    private initPlaces(place){
        return this.formBuilder.group({
            keyword: place.field_place_address,
            description: place.field_place_comment,
            lat: place.field_latitude,
            lng:place.field_longitude,
            slug: place.field_slug,
            image: place.field_place_images[0].url
        });
    }

    private initAddress() {
        return this.formBuilder.group({
            keyword: ['', Validators.required],
            description: ['', Validators.required],
            lat: [''],
            lng: [''],
            slug: [''],
            image: ['', Validators.required]
        });
    }

    // for preview
    private initMap() {
        this.currentHighlightedMarker = 0;
        console.log(this.previewData.listPlaces);
        this.slides = [];
        this.markers = [];
        this.showPreview = true;
        if (this.previewData.listPlaces && this.previewData.listPlaces.length) {
            let index = 0;
            for (let place of this.previewData.listPlaces) {
                if (place.lat && place.lng) {
                    if (index === 0) {
                        this.markers.push({lat: parseFloat(place.lat), lng: parseFloat(place.lng), opacity: 1, isOpenInfo: true});
                    } else {
                        this.markers.push({lat: parseFloat(place.lat), lng: parseFloat(place.lng), opacity: 0.4, isOpenInfo: false});
                    }
                    index++;
                }
            }
        }
        if (this.previewData.images.length) {
            for (let img of this.previewData.images) {
                if (img) {
                    this.slides.push({image: img.url, active: false});
                }
            }

        }
    }

    // helper functions
    private resizeImage(img, maxWidth, maxHeight, callback) {
        return img.onload = () => {
            // get image dimension
            let width = img.width;
            let height = img.height;

            // set width and height to the max values
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            // create canvas object
            let canvas = document.createElement('canvas');

            // set canvas to the new calculated dimension values
            canvas.width = maxWidth;
            canvas.height = maxHeight;

            // create canvas context 2d and align image to center
            let startX = maxWidth / 2 - width / 2;
            let startY = maxHeight / 2 - height / 2;
            let ctx = canvas.getContext('2d', {alpha: false});

            // draw image to canvas
            ctx.drawImage(img, startX, startY, width, height);

            // convert canvas to image
            let dataUrl = canvas.toDataURL('image/jpeg');

            // run callback with result
            callback(dataUrl);

        };
    }
}