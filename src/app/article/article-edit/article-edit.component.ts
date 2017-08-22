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
import { AppSetting } from '../../app.setting';

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css']
})

export class ArticleEditComponent implements OnInit {
  public favorite: any;
  public categories: any[];
  public selectedCategories = [];
  public places = [];
  public markers = [];
  public showPreview: boolean = false;
  public canAddMoreImages: boolean = true;
  public submitted: boolean = false;
  public validCaptcha: boolean = false;
  public previewUrls: Image[] = [];

  public NextPhotoInterval: number = 5000;
  public noLoopSlides: boolean = false;
  public noTransition: boolean = false;
  public slides = [];

  public lat = AppSetting.SingaporeLatLng.lat;
  public lng = AppSetting.SingaporeLatLng.lng;
  public zoom: number = 12;
  public validateSize: boolean = true;
  public validateType: boolean = true;

  public layoutWidth: number;
  public innerWidth: number;

  public contentControl: any;

  public slugName: any;
  public user: User;

  public article: Article;
  public previewData: any;

  public ready = false;

  public currentHighlightedMarker: number = null;
  public formData = this.formBuilder.group({
    listName: ['', Validators.required],
    listDescription: ['', Validators.required],
    listCategory: ['', Validators.required],
    listCatTmp: [''],
    listImages: [''],
    places: this.formBuilder.array([])
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
              public appGlobal: AppGlobals) {
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
        if (this.innerWidth <= 900) {
          this.appGlobal.isShowLeft = true;
          this.appGlobal.isShowRight = false;
        } else {
          this.appGlobal.isShowLeft = true;
          this.appGlobal.isShowRight = true;
        }
        this.layoutWidth = (this.windowRef.rootContainer.width - 180);
        this.appGlobal.toggleMap = true;
        this.ready = true;
      });
    });
  }

  public onSubmit() {
    let article = this.formData.value;
    this.places = [];
    let places = article.places;
    for (let place of places) {
      this.places.push({
        field_place_comment: place.description,
        field_latitude: place.lat,
        field_longitude: place.lng,
        field_slug: place.slug,
        field_place_address: place.keyword,
        field_place_images: [place.image],
      });
    }
    article.id = this.article.id;
    article.places = this.places;
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
    const placeControl = this.formData.get('places') as FormArray;
    placeControl.push(placeCtrl);
  }

  public removeAddress(i: number) {
    const control = <FormArray> this.formData.controls['places'];
    control.removeAt(i);
  }

  public onRemovePreview(imageUrl) {
    let imageId = this.previewUrls.indexOf(imageUrl);
    delete this.previewUrls[imageId];
    this.previewUrls = this.previewUrls.filter((img) => img !== imageUrl);
    if (this.previewUrls.length < 5) {
      this.canAddMoreImages = true;
    }
  }

  public readUrl(event) {
    const reader = [];
    if (event.target.files && event.target.files[0] && this.previewUrls.length < 5) {
      const fileTypesRegex = new RegExp(/\/(jpe?g|png|gif|bmp)$/, 'i');
      const maxNumImages = 5;
      const maxImageSize = 6291456;
      for (let i = 0; i < event.target.files.length && i < maxNumImages; i++) {
        let size = event.target.files[i].size;
        let type = event.target.files[i].type;
        if (size < maxImageSize && fileTypesRegex.test(type)) {
          reader[i] = new FileReader();
          reader[i].onload = (e) => {
            const image = new Image();
            image.src = e.target.result;

            this.resizeImage(image, 680, 360, (resizedImage) => {
              let img = {
                fid: null,
                url: resizedImage,
                value: e.target.result.replace(/^data:image\/\S+;base64,/, ''),
                filename: event.target.files[i].name.substr(0, 50),
                filemime: event.target.files[i].type,
                filesize: event.target.files[i].size,
              };
              if (this.previewUrls.length < maxNumImages) {
                this.previewUrls.push(img);
              }
              if (this.previewUrls.length >= maxNumImages) {
                this.canAddMoreImages = false;
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

  public onPreview() {
    this.previewData = this.formData.value;
    this.previewData.images = this.previewUrls;
    this.initPreview();
    window.scroll(0, 0);
  }

  public checkCaptcha(captcha) {
    if (captcha) {
      this.validCaptcha = true;
    }
  }

  public switchView(showPreview: boolean) {
    this.showPreview = showPreview;
    if (showPreview) {
      this.onPreview();
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
        let placeControl = this.formData.get('places') as FormArray;
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
    let placeControl = this.formData.get('places') as FormArray;
    let place = placeControl.at(i);
    if (data.Title) {
      place.patchValue({
        keyword: data.Title,
        lat: +data.Lat || AppSetting.SingaporeLatLng.lat,
        lng: +data.Long || AppSetting.SingaporeLatLng.lng,
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
    const control = <FormArray> this.formData.controls.places;
    for (let place of res.field_places) {
      const img = place.field_place_images.length ? {
        fid: place.field_place_images[0].fid,
        url: place.field_place_images[0].url,
        value: '',
        filename: '',
        filemime: '',
        filesize: 0
      } : null;
      control.push(this.formBuilder.group(
        {
          fcl_id: place.fcl_id,
          keyword: [place.field_place_address, Validators.required],
          inputAddress: '',
          description: [place.field_place_comment, Validators.required],
          lat: [place.field_latitude, Validators.required],
          lng: [place.field_longitude, Validators.required],
          slug: place.field_slug,
          image: img
        }
      ));
    }
  }

  private initPreview() {
    this.currentHighlightedMarker = 0;
    this.slides = [];
    this.markers = [];
    this.showPreview = true;
    if (this.previewData.places && this.previewData.places.length) {
      let index = 0;
      for (let place of this.previewData.places) {
        if (place.lat && place.lng) {
          this.markers.push({
            lat: +place.lat,
            lng: +place.lng,
            opacity: index === 0 ? 1 : 0.4,
            isOpenInfo: true,
            icon: 'assets/icon/locationmarker.png'
          });
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
    field_places: article.places
  };
}
