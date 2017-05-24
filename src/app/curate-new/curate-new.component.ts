import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MainService } from '../services/main.service';
import { AppState } from '../app.service';
import { MapsAPILoader } from 'angular2-google-maps/core';

@Component({
  selector: 'app-curate-new',
  templateUrl: './curate-new.component.html',
  styleUrls: ['./curate-new.component.css']
})

export class CurateNewComponent implements OnInit {
  public userInfo: any;
  public publicProfile: any;
  public favorite: any;
  public categories: any[];
  public previewUrl: string[] = [];
  public places: any[] = [];

  public listFormData = this.fb.group({
    listName: ['', Validators.required],
    listDescription: ['', Validators.required],
    listCategory: ['', Validators.email],
    listImages: ['', Validators.required]
  });

  constructor(public fb: FormBuilder, private mainService: MainService, private appState: AppState,
              private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
  }

  public onRemovePreview(imageUrl) {
    console.log(imageUrl);
    let imageId = this.previewUrl.indexOf(imageUrl);
    delete this.previewUrl[imageId];
    this.previewUrl = this.previewUrl.filter((img) => img !== imageUrl);
  }

  public onAddPlace() {
    console.log('add');
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
      infor: this.listFormData,
      images: this.previewUrl,
      places: this.places
    };
    // this.appState.set('userDraftList', userDraftList);
  }

  public updatePlace(place: any) {
    console.log('update place: ', place);
  }

  public ngOnInit() {
    this.mainService.getUserPublicProfile().then((resp) => {
      this.categories = resp.categories;
    });
  }
}
