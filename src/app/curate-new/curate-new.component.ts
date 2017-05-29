import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MainService } from '../services/main.service';
import { AppState } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-curate-new',
  templateUrl: './curate-new.component.html',
  styleUrls: ['./curate-new.component.css']
})

export class CurateNewComponent implements OnInit {
  public userInfo: any;
  public favorite: any;
  public categories: any[];
  public previewUrl: string[] = [];
  public markers: any[] = [];
  public showPreview: boolean = false;

  public NextPhotoInterval: number = 5000;
  public noLoopSlides: boolean = false;
  public noTransition: boolean = false;
  public slides: any[] = [];

  public lat: number = 1.290270;
  public lng: number = 103.851959;
  public zoom: number = 12;

  public currentHighlightedMarker: number = null;
  public formData = this.formBuilder.group({
    listName: ['', Validators.required],
    listDescription: ['', Validators.required],
    listCategory: ['', Validators.email],
    listImages: ['', Validators.required],
    listPlaces: this.formBuilder.array([])
  });

  constructor(public formBuilder: FormBuilder,
              public appState: AppState,
              private mainService: MainService,
              private router: Router) {
    this.onAddPlace();
  }

  public onAddPlace() {
    const control = <FormArray> this.formData.controls['listPlaces'];
    const placeCtrl = this.initAddress();
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
  }

  public readUrl(event) {
    let reader = [];
    if (event.target.files && event.target.files[0]) {
      for (let i = 0; i < event.target.files.length; i++) {
        reader[i] = new FileReader();
        reader[i].onload = (e) => {
          this.previewUrl.push(e.target.result);
        };
        reader[i].readAsDataURL(event.target.files[i]);
      }
    }
  }

  public onSubmit() {
    let userDraftList = {
      info: this.formData.value,
      images: this.previewUrl
    };
    console.log('userDraftList', JSON.stringify(userDraftList));
    this.router.navigate(['/curate-detail/123abc']);
  }

  public onPreview() {
    let userDraftList = {
      info: this.formData.value,
      images: this.previewUrl
    };
    this.appState.set('userDraftList', userDraftList);
    console.log('userDraftList', this.appState.state.userDraftList);
    this.initMap();
  }

  public ngOnInit() {
    this.mainService.getUserPublicProfile().then((resp) => {
      this.categories = resp.categories;
    });
  }

  public switchView(status: boolean) {
    this.showPreview = status;
    if (status) {
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

  public markerClick(markerId) {
    console.log('markerClick', markerId);
    // console.log('scroll to: ', document.getElementById('place-' + markerId).offsetTop);
    // window.scrollTo(0, document.getElementById('place-' + markerId).offsetTop);
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

  private initAddress() {
    return this.formBuilder.group({
      place: ['', Validators.required],
      description: [''],
      lat: [''],
      lng: [''],
      image: ['']
    });
  }

  // for preview
  private initMap() {
    this.currentHighlightedMarker = 0;
    this.slides = [];
    this.markers = [];
    this.showPreview = true;
    if (this.appState.state.userDraftList.info.listPlaces.length) {
      let index = 0;
      for (let place of this.appState.state.userDraftList.info.listPlaces) {
        if (place.lat && place.lng) {
          if (index === 0) {
            this.markers.push({lat: place.lat, lng: place.lng, opacity: 1, isOpenInfo: true});
          } else {
            this.markers.push({lat: place.lat, lng: place.lng, opacity: 0.4, isOpenInfo: false});
          }
          index++;
        }
      }
      if (this.appState.state.userDraftList.images.length) {
        for (let img of this.appState.state.userDraftList.images) {
          if (img) {
            this.slides.push({image: img, active: false});
          }
        }

      }
    }
  }
}
