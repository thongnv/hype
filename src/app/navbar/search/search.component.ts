import {Component, ElementRef, HostListener, OnInit, ViewChild, SecurityContext} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { MainService } from '../../services/main.service';
import { WindowRefService } from "../../services/window-ref.service"

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
  private searchRoute = '/search';

  constructor(public fb: FormBuilder,
              private sanitizer: DomSanitizer,
              private mainService: MainService,
              private windowRefService: WindowRefService,
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
    const keyCode = event.which || event.keyCode;
    this.searchToken = event.type === 'submit' ?
      this.searchForm.value.keyword.trim() : keyword.trim();

    // sanitize keywords
    // this.searchToken = this.sanitizer.sanitize(SecurityContext.HTML, this.searchToken);

    if (this.searchToken.length >= 3) {
      if (keyCode == 13) {
        this.hideSearchResult = true;
      }
      // this.hideSearchResult = this.router.url.startsWith(this.searchRoute);
      this.mainService.search(this.searchToken).subscribe((resp) => {
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
    let keywords = this.keywords.nativeElement.value;
    // keywords = this.sanitizer.sanitize(SecurityContext.HTML, this.keywords.nativeElement.value);
    const keyCode = event.which || event.keyCode;
    const isSearchResultPage = this.router.url.startsWith(this.searchRoute);

    if (keyCode === 13 && keywords.trim() !== '') {
      if (isSearchResultPage) {
        // this.router.navigate([this.searchRoute], {queryParams: {keywords: keywords}})

        // TODO: this for fix component does not reload when route change
        this.windowRefService.nativeWindow.location = `/search?keywords=${keywords}`;
      } else {
        this.hideSearchResult = true;
        this.router.navigate([this.searchRoute], {queryParams: {keywords: keywords}})
      }
    }

  }

  public onOpenSuggestion() {
    this.hideSearchResult = false;
  }
}
