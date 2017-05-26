import { Component, ContentChild, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MainService } from '../services/main.service';
import { AppState } from '../app.service';
import { Router } from '@angular/router';
import { letProto } from 'rxjs/operator/let';

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

  public listFormData = this.fb.group({
    listName: ['', Validators.required],
    listDescription: ['', Validators.required],
    listCategory: ['', Validators.email],
    listImages: ['', Validators.required],
    listPlaces: this.fb.array([])
  });

  constructor(public fb: FormBuilder, private mainService: MainService,
              public appState: AppState) {
    this.onAddPlace();
  }

  public onAddPlace() {
    const control = <FormArray> this.listFormData.controls['listPlaces'];
    const placeCtrl = this.initAddress();
    control.push(placeCtrl);
  }

  public removeAddress(i: number) {
    const control = <FormArray> this.listFormData.controls['listPlaces'];
    control.removeAt(i);
  }

  public onRemovePreview(imageUrl) {
    let imageId = this.previewUrl.indexOf(imageUrl);
    delete this.previewUrl[imageId];
    this.previewUrl = this.previewUrl.filter((img) => img !== imageUrl);
  }

  public readUrl(event) {
    console.log(event.target.files.length);
    let reader = [];
    if (event.target.files && event.target.files[0]) {
      for (let i = 0; i < event.target.files.length; i++) {
        reader[i] = new FileReader();
        reader[i].onload = (event) => {
          this.previewUrl.push(event.target.result);
        };
        reader[i].readAsDataURL(event.target.files[i]);
      }
    }
  }

  public onSubmit() {
    let userDraftList = {
      infor: this.listFormData.value,
      images: this.previewUrl
    };
    console.log('userDraftList', userDraftList);
  }

  public onPreview() {
    let userDraftList = {
      infor: this.listFormData.value,
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

  public switchView() {
    this.showPreview = this.showPreview ? false : true;
  }

  private initAddress() {
    return this.fb.group({
      place: ['', Validators.required],
      description: [''],
      lat: [''],
      lng: [''],
      image: ['']
    });
  }

  // for preview
  private initMap() {
    this.slides = [];
    this.showPreview = true;
    if (this.appState.state.userDraftList.infor.listPlaces.length) {
      for (let place of this.appState.state.userDraftList.infor.listPlaces) {
        if (place.lat && place.lng) {
          this.markers.push({lat: place.lat, lng: place.lng});
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
