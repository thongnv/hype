import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { CompanyDetailComponent } from '../company-detail/company-detail.component';
import { BaseUser } from '../../app.interface';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-write-review',
  templateUrl: './write-review.component.html',
  styleUrls: ['./write-review.component.css'],
  providers: [NgbRatingConfig]
})
export class WriteReviewComponent implements OnInit {
  @Output('onScrollToBottom') public onScrollToBottom = new EventEmitter<any>();
  @Input() public submitted: boolean;
  @Input() public company: CompanyDetailComponent;
  @Input() public user: BaseUser;

  @Output() public change = new EventEmitter<any>();

  public previewUrl: any[] = [];
  public currentRate = 0;
  public review: any;
  public reviewForm: FormGroup = this.fb.group({
    text: ['', Validators.required],
    images: [''],
  });

  constructor(
    public fb: FormBuilder,
    public rateConfig: NgbRatingConfig,
    public sanitizer: DomSanitizer) {
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
          let img = {
            fid: null,
            url: URL.createObjectURL(event.target.files[i]),
            value: e.target.result.replace(/^data:image\/\S+;base64,/, ''),
            filename: event.target.files[i].name.substr(0, 50),
            filemime: event.target.files[i].type,
            filesize: event.target.files[i].size
          };
          this.previewUrl.push(img);
        };
        reader[i].readAsDataURL(event.target.files[i]);
      }
    }
  }

  public closeForm() {
    this.submitted = false;
    this.currentRate = 0;
    this.previewUrl = [];
    this.reviewForm.reset();
    this.change.emit(this.submitted);
  }

  public onSubmit() {
    this.review = this.reviewForm.value;
    if (this.review.text) {
      this.review.images = this.previewUrl;
      this.review.rating = this.currentRate;
      this.change.emit(this.review);
      this.reviewForm.reset();
      this.previewUrl = [];
      this.currentRate = 0;
    }
  }

  public onScrollDown(event) {
    let elm = event.srcElement;
    if (elm.clientHeight + elm.scrollTop === elm.scrollHeight) {
      this.onScrollToBottom.emit(null);
    }
  }
}
