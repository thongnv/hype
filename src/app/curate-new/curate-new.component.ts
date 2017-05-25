import { Component, ContentChild, OnInit } from '@angular/core';
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
  public places: any[] = [];

  public listFormData = this.fb.group({
    listName: ['', Validators.required],
    listDescription: ['', Validators.required],
    listCategory: ['', Validators.email],
    listImages: ['', Validators.required],
    listPlaces: this.fb.array([])
  });

  constructor(public fb: FormBuilder, private mainService: MainService,
              private appState: AppState, private router: Router) {
    this.places.push({
      id: 1,
      location: {
        lat: '',
        lng: '',
        name: ''
      },
      description: ''
    });
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
    console.log(imageUrl);
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
    this.router.navigate(['/curate/preview']);
  }

  public ngOnInit() {
    this.mainService.getUserPublicProfile().then((resp) => {
      this.categories = resp.categories;
    });
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
}
