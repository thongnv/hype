import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, Title } from '@angular/platform-browser';

import { MainService } from '../../services/main.service';
import { LoaderService } from '../../helper/loader/loader.service';
import { Article, Image, User } from '../../app.interface';
import { WindowUtilService } from '../../services/window-ultil.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { AppGlobals } from '../../services/app.global';

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css']
})

export class ArticleEditComponent implements OnInit {
  public favorite: any;
  public categories: any[];
  public selectedCategories = [];
  public listPlaces: any[] = [];
  public markers: any[] = [];
  public showPreview: boolean = false;
  public addImage: boolean = true;
  public submitted: boolean = false;
  public validCaptcha: boolean = false;
  public previewUrls: Image[] = [];

  public NextPhotoInterval: number = 5000;
  public noLoopSlides: boolean = false;
  public noTransition: boolean = false;
  public slides: any[] = [];
  public previewData: any;
  public lat: number = 1.290270;
  public lng: number = 103.851959;
  public zoom: number = 12;
  public validateSize: boolean = true;
  public validateType: boolean = true;
  public layoutWidth: number;
  public innerWidth: number;

  public article: Article;
  public contentControl: any;
  public slugName: any;
  public user: User;

  public ready = false;

  public currentHighlightedMarker: number = null;
  public formData = this.formBuilder.group({
    listName: ['', Validators.required],
    listDescription: ['', Validators.required],
    listCategory: ['', Validators.required],
    listCatTmp: [''],
    listImages: [''],
    listPlaces: this.formBuilder.array([])
  });

  constructor(public formBuilder: FormBuilder,
              private mainService: MainService,
              private titleService: Title,
              private localStorageService: LocalStorageService,
              public sanitizer: DomSanitizer,
              private loaderService: LoaderService,
              private router: Router,
              private windowRef: WindowUtilService,
              private route: ActivatedRoute,
              private appGlobal: AppGlobals,
          ) {
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    console.log(event);
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 180);
  }

  public ngOnInit() {
    this.user = this.localStorageService.get('user') as User;
    if (!this.user || this.user.isAnonymous) {
      this.router.navigate(['/login']).then();
      return;
    }
    this.route.params.subscribe((e) => {
      this.slugName = e.slug;
      this.mainService.getArticle(this.slugName).subscribe((res) => {
        if (res.user_post.slug !== '/user/' + this.user.slug) {
          this.router.navigate(['article', e.slug]).then();
          return;
        }
        this.titleService.setTitle(res.title);
        this.loadDataIntoForm(res);
        this.article.id = res.nid;
        this.mainService.getCategoryArticle().subscribe(
          (response: any) => {
            this.categories = response.data;
          }
        );
        this.innerWidth = this.windowRef.nativeWindow.innerWidth;

        if(this.innerWidth <= 900){
          this.appGlobal.isShowLeft = true;
          this.appGlobal.isShowRight = false;
        }else{
          this.appGlobal.isShowLeft = true;
          this.appGlobal.isShowRight = true;
        }

        this.layoutWidth = (this.windowRef.rootContainer.width - 180);
        this.ready = true;
      });
    });
  }

  public onAddPlace() {
    const placeCtrl = this.formBuilder.group({
      keyword: ['', Validators.required],
      inputAddress: [''],
      description: ['', Validators.required],
      lat: ['', Validators.required],
      lng: ['', Validators.required],
      slug: [''],
      image: ['']
    });
    const placeControl = this.formData.get('listPlaces') as FormArray;
    placeControl.push(placeCtrl);
  }

  public removeAddress(i: number) {
    const control = <FormArray> this.formData.controls['listPlaces'];
    control.removeAt(i);
  }

  public onRemovePreview(imageUrl) {
    let imageId = this.previewUrls.indexOf(imageUrl);
    delete this.previewUrls[imageId];
    this.previewUrls = this.previewUrls.filter((img) => img !== imageUrl);
    if (this.previewUrls.length < 5) {
      this.addImage = true;
    }
  }

  public readUrl(event) {
    let reader = [];
    if (event.target.files && event.target.files[0] && this.previewUrls.length < 5) {
      let typeFile = new RegExp(/\/(jpe?g|png|gif|bmp)$/, 'i');
      for (let i = 0; i < event.target.files.length && i < 5; i++) {
        let size = event.target.files[i].size;
        let type = event.target.files[i].type;
        if (size < 6291456 && typeFile.test(type)) {
          reader[i] = new FileReader();
          reader[i].onload = (e) => {
            let image = new Image();
            image.src = e.target.result;

            this.resizeImage(image, 680, 360, (resizedImage) => {
              let img = {
                fid: null,
                url: resizedImage,
                value: e.target.result.replace(/^data:image\/\S+;base64,/, ''),
                filename: event.target.files[i].name,
                filemime: event.target.files[i].type,
                filesize: event.target.files[i].size,
              };
              if (this.previewUrls.length < 5) {
                this.previewUrls.push(img);
              }
              if (this.previewUrls.length >= 5) {
                this.addImage = false;
              }
            });
          };
          reader[i].readAsDataURL(event.target.files[i]);
        } else {
          this.validateSize = false;
          this.validateType = false;
        }
      }
    }
  }

  public onSubmit() {
    let article = this.formData.value;
    this.listPlaces = [];
    let address = article.listPlaces;
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
    article.id = this.article.id;
    article.listPlaces = this.listPlaces;
    article.listImages = this.previewUrls;
    article.listCategory = this.processCategories(article.listCategory);
    let data = mapArticle(article);
    this.loaderService.show();
    if (!this.submitted) {
      this.mainService.updateArticle(data).subscribe(
        (response) => {
          this.submitted = false;
          this.router.navigate([response.data.slug]).then();
        },
        (error) => {
          this.loaderService.hide();
          console.log(error);
        }
      );
    }
  }

  public onPreview() {
    this.previewData = this.formData.value;
    this.previewData.images = this.previewUrls;
    this.initMap();
  }

  public checkCaptcha(captcha) {
    if (captcha) {
      this.validCaptcha = true;
    }
  }

  public switchView(status: boolean) {
    this.showPreview = status;
    if (status) {
      this.previewData = this.formData.value;
      this.previewData.images = this.previewUrls;
      this.initMap();
    }
  }

  public onScroll(event) {
    let baseHeight = event.target.clientHeight;
    let realScrollTop = event.target.scrollTop + baseHeight;
    let currentHeight: number = baseHeight;

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

  public onMapsChangePlace(data, i) {
    // get lat long from place id
    let geoCoder = new google.maps.Geocoder();
    geoCoder.geocode({placeId: data.place_id}, (results, status) => {
      if (status.toString() === 'OK') {
        // set lat long for eventPlace
        let placeControl = this.formData.get('listPlaces') as FormArray;
        let place = placeControl.at(i);
        place.patchValue({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
          slug: '',
        });
      }
    });
  }

  public onHyloChangePlace(data, i) {
    let placeControl = this.formData.get('listPlaces') as FormArray;
    let place = placeControl.at(i);
    if (data.Title) {
      place.patchValue({
        keyword: data.Title,
        lat: Number(data.Lat),
        lng: Number(data.Long),
        slug: data.Slug,
      });
    }
  }

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

  private loadDataIntoForm(res) {
    this.article = res;
    this.contentControl = res.body;
    for (let category of res.field_category) {
      this.selectedCategories.push(category.name);
    }
    for (let img of res.field_images) {
      this.previewUrls.push({
        fid: img.fid,
        url: img.url,
        value: '',
        filename: '',
        filemime: '',
        filesize: 0
      });
    }
    this.formData.controls.listName.patchValue(res.title);
    this.formData.controls.listDescription.patchValue(res.body);
    const control = <FormArray> this.formData.controls['listPlaces'];
    for (let place of res.field_places) {
      if (place.field_latitude) {
        let img: string;
        if (place.field_place_images.length) {
          img = place.field_place_images[0].url;
        }
        const placeControl = this.formBuilder.group(
          {
            fcl_id: place.fcl_id,
            keyword: place.field_place_address,
            inputAddress: '',
            description: place.field_place_comment,
            lat: place.field_latitude,
            lng: place.field_longitude,
            slug: place.field_slug,
            image: img
          }
        );
        control.push(placeControl);
      }
    }
  }

  // for preview
  private initMap() {
    this.currentHighlightedMarker = 0;
    this.slides = [];
    this.markers = [];
    this.showPreview = true;
    if (this.previewData.listPlaces && this.previewData.listPlaces.length) {
      let index = 0;
      for (let place of this.previewData.listPlaces) {
        if (place.lat && place.lng) {
          if (index === 0) {
            this.markers.push({
              lat: place.lat,
              lng: place.lng,
              opacity: 1,
              isOpenInfo: true,
              icon: 'assets/icon/locationmarker.png'
            });
          } else {
            this.markers.push({
              lat: place.lat,
              lng: place.lng,
              opacity: 0.4,
              isOpenInfo: false,
              icon: 'assets/icon/locationmarker.png'
            });
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

  private processCategories(category) {
    let selectedCategories = [];
    for (let name of category) {
      let addCategory = this.categories.filter(
        (term) => term.name === name
      );
      if (addCategory[0].tid) {
        selectedCategories.push(addCategory[0].tid);
      }
    }
    return selectedCategories;
  }

  private highlightMarker(markerId: number): void {
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
}

function mapArticle(article) {
  return {
    nid: article.id,
    title: article.listName,
    body: article.listDescription,
    field_images: article.listImages,
    category: article.listCategory,
    field_places: article.listPlaces
  };
}
