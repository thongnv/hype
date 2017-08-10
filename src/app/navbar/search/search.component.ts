import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @ViewChild('keyword') keywords: ElementRef;

  public searchForm: FormGroup;
  public hideSearchResult: boolean = true;
  public hideNoResult: boolean = false;
  public result: any = {};
  public searchToken: string = '';

  public shownotfound: boolean = false;

  constructor(public fb: FormBuilder,
              private mainService: MainService,
              private _elRef: ElementRef,
              private router: Router) {
  }

  @HostListener('document:click', ['$event'])

  public onClick(event) {
    if (!this._elRef.nativeElement.contains(event.target)) {
      this.hideSearchResult = true;
    }
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
        console.log('resp: ', resp);
        this.result = resp;
        if (resp.event.length + resp.article.length + resp.company.length === 0) {
          this.hideNoResult = false;
          this.shownotfound = true;
        } else {
          this.hideNoResult = true;
          this.shownotfound = false;
        }
      });
    } else {
      this.result = {};
      this.hideNoResult = false;
    }
  }

  onKeyDown(event) {
    const keywords = this.keywords.nativeElement.value;
    const keyCode = event.which || event.keyCode;

    if (keyCode === 13) {
      if (this.router.url.startsWith('/search-result')) {
        this.router.navigate(['/search-result', keywords]);
        location.reload();
      } else {
        this.router.navigate(['/search-result', keywords]);
      }
    }

  }

  public onOpenSuggestion() {
    this.hideSearchResult = false;
  }
}
