import { Component, ContentChild, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MainService } from '../services/main.service';

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
    listImages: ['', Validators.required],
    listPlaces: this.fb.array([])
  });
  @ContentChild('templatePlace') public testEl: any;

  constructor(public fb: FormBuilder, private mainService: MainService) {
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

    /* subscribe to individual address value changes */
    // addrCtrl.valueChanges.subscribe(x => {
    //   console.log(x);
    // })
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

  public onAddPlace2() {
    console.log('add');
    this.places.push({
      id: 1,
      location: {
        lat: '',
        lng: '',
        name: ''
      },
      description: ''
    });
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

  private initAddress() {
    return this.fb.group({
      place: ['', Validators.required],
      description: [''],
      lat: [''],
      lng: ['']
    });
  }
}
