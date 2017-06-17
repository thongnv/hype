import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public searchForm: FormGroup;

  constructor(public fb: FormBuilder, private mainservice: MainService) {
  }

  public ngOnInit() {
    this.searchForm = this.fb.group({
      keyword: ['', Validators.required]
    });
  }

  public onSubmit() {
    console.log('keyword: ', this.searchForm.value.keyword);
    if(this.searchForm.value.keyword.trim().length){
      this.mainservice.getUserInterest()
    }
  }
}
