import { Injectable } from '@angular/core';
import {Title, Meta} from '@angular/platform-browser';

@Injectable()
export class SeoService {

  constructor(private meta: Meta) { }

  /**
   * Set SEO meta tags for web page
   * @param title: title of the page
   * @param author: author of the page
   * @param keywords: keywords for search engine
   * @param description: short description of the page
   */
  setSEOMetaTags(title: string, author: string, keywords: string, description: string) {
    this.meta.addTags([
      {name: 'author', content: author},
      {name: 'keywords', content: keywords},
      {name: 'description', content: description},
    ]);
  }

}
