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
  public hideSearchResult: boolean = true;
  public hideNoResult: boolean = false;
  public result: any = {};
  public searchToken: string = '';

  constructor(public fb: FormBuilder, private mainService: MainService) {
  }

  public ngOnInit() {
    this.searchForm = this.fb.group({
      keyword: ['', Validators.compose([Validators.required, Validators.minLength(3)])]
    });
  }

  public onSubmit(event, keyword?: string) {
    this.hideSearchResult = false;
    this.searchToken = event.type === 'submit' ?
      this.searchForm.value.keyword.trim() : keyword.trim();

    if (this.searchToken.length >= 3) {
      this.hideSearchResult = false;
      this.mainService.search(this.searchToken).subscribe((resp) => {
        this.result = resp;
        if (resp.event.length + resp.article.length + resp.company.length === 0) {
          this.hideNoResult = false;
        } else {
          this.hideNoResult = true;
        }
      });
    } else {
      this.result = {};
      this.hideNoResult = false;
    }
  }

  public onCloseSuggestion() {
    this.hideSearchResult = true;
  }

  public onOpenSuggestion() {
    this.hideSearchResult = false;
  }
}
