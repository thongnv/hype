import {Component, ElementRef, HostListener, OnInit, ViewChild, SecurityContext} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { MainService } from '../../services/main.service';
import { WindowRefService } from '../../services/window-ref.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @ViewChild('keyword') public keywords: ElementRef;

  public searchForm: FormGroup;
  public hideSearchResult: boolean = true;
  public hideNoResult: boolean = false;
  public result: any = {};
  public searchToken: string = '';

  public shownotfound: boolean = false;
  private searchRoute = '/search';

  constructor(public fb: FormBuilder,
              private mainService: MainService,
              private _elRef: ElementRef,
              private windowRefService: WindowRefService,
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
    this.hideSearchResult = true;
  }

  public onSubmit(event, keyword?: string) {
    this.hideSearchResult = false;
    if (keyword) {
      this.searchToken = keyword.trim();
    }
    let keywords = this.searchToken;

    if (keywords.length >= 3) {
      this.mainService.search(keywords).subscribe((resp) => {
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

    if (event.type === 'submit' || event.code === 'Enter') {
      const isSearchResultPage = this.router.url.startsWith(this.searchRoute);
      if (isSearchResultPage) {
        // component does not reload when keywords changes
        this.windowRefService.nativeWindow.location = `/search?keywords=${keywords}`;
      } else {
        this.router.navigate([this.searchRoute], {queryParams: {keywords}}).then();
      }
      this.hideSearchResult = true;
    }
  }

  public onCloseSuggestion() {
    this.hideSearchResult = true;
  }

}
