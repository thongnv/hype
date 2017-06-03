import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-write-review',
  templateUrl: './write-review.component.html',
  styleUrls: ['./write-review.component.css'],
  providers: [NgbRatingConfig]
})
export class WriteReviewComponent implements OnInit {
  @Input()
  public status: boolean;

  @Output()
  public change = new EventEmitter<any>();

  public previewUrl: string[] = [];
  public currentRate = 0;
  public review: any;
  public reviewForm: FormGroup = this.fb.group({
    text: ['', Validators.required],
    images: [''],
  });

  constructor(public fb: FormBuilder, public rateConfig: NgbRatingConfig) {
    this.rateConfig.max = 5;
    this.rateConfig.readonly = false;
  }

  public ngOnInit() {
    // TODO
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

  public closeForm() {
    this.status = false;
    this.change.emit(this.status);
  }

  public onSubmit() {
    this.review = this.reviewForm.value;
    this.review.images = this.previewUrl;
    this.review.rating = this.currentRate;
    this.change.emit(this.review);
    this.reviewForm.reset();
    this.previewUrl = [];
  }
}
