import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, Title } from '@angular/platform-browser';

import { MainService } from '../../services/main.service';
import { LoaderService } from '../../helper/loader/loader.service';
import { UserService } from '../../services/user.service';
import { WindowUtilService } from '../../services/window-ultil.service';

@Component({
  selector: 'app-curate-new',
  templateUrl: './curate-new.component.html',
  styleUrls: ['./curate-new.component.css']
})

export class CurateNewComponent implements OnInit {
  public favorite: any;
  public categories: any[];
  public defaultCategories: any[];
  public previewUrl: any[] = [];
  public listPlaces: any[] = [];
  public markers: any[] = [];
  public showPreview: boolean = false;
  public addImage: boolean = true;
  public submitted: boolean = false;
  public validCaptcha: boolean = false;
  public chooseCategories: any[] = [];

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
              private userService: UserService,
              private titleService: Title,
              public sanitizer: DomSanitizer,
              private loaderService: LoaderService,
              private router: Router,
              private windowRef: WindowUtilService) {
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 185);
  }

  public ngOnInit() {
    this.titleService.setTitle('Create A New List');
    this.onAddPlace();
    document.getElementById('list-name').focus();
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 185);
    this.userService.checkLogin().subscribe(
      (response: any) => {
        if (response === 0) {
          this.router.navigate(['/login'], {skipLocationChange: true}).then();
        }
      }
    );
    this.mainService.getCategoryArticle().subscribe(
      (response: any) => {
        this.categories = response.data;
      }
    );
  }

  public onAddPlace() {
    const control = <FormArray> this.formData.controls['listPlaces'];
    const placeCtrl = this.formBuilder.group({
      keyword: ['', Validators.required],
      inputAddress: [''],
      description: ['', Validators.required],
      lat: ['', Validators.required],
      lng: ['', Validators.required],
      slug: [''],
      image: ['']
    });
    control.push(placeCtrl);
  }

  public removeAddress(i: number) {
    const control = <FormArray> this.formData.controls['listPlaces'];
    control.removeAt(i);
  }

  public onRemovePreview(imageUrl) {
    let imageId = this.previewUrl.indexOf(imageUrl);
    delete this.previewUrl[imageId];
    this.previewUrl = this.previewUrl.filter((img) => img !== imageUrl);
    if (this.previewUrl.length < 5) {
      this.addImage = true;
    }
  }

  public readUrl(event) {
    let reader = [];
    if (event.target.files && event.target.files[0] && this.previewUrl.length < 5) {
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
              if (this.previewUrl.length < 5) {
                this.previewUrl.push(img);
              }
              if (this.previewUrl.length >= 5) {
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
    if (this.formData.valid) {
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
      article.listPlaces = this.listPlaces;
      article.listImages = this.previewUrl;
      article.listCategory = this.processCategories(article.listCategory);
      let  data = this.mapArticle(article);
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
    this.previewData = this.formData.value;
    this.previewData.images = this.previewUrl;
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
      this.previewData.images = this.previewUrl;
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
    for (let name of category) {
      let addCategory = this.categories.filter(
        (term) => term.name === name
      );
      if (addCategory[0].tid) {
        this.chooseCategories.push(addCategory[0].tid);
      }
    }
    return this.chooseCategories;
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
