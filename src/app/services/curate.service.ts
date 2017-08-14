import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';

import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

import {
  Article, ArticlesCategory, BaseUser, Category, Company, HyloEvent, Image
} from '../app.interface';
import { AppSetting } from '../app.setting';

const MOCK_ACTIONS = [
  'Buy Tickets',
  'More info'
];

@Injectable()
export class CurateService {

  private defaultHeaders = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRF-Token': this.localStorageService.get('csrf_token')
  });

  constructor(private localStorageService: LocalStorageService,
              private http: Http) {
  }

  public getArticleCategories(): Observable<Category[]> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/category/tree/?_format=json', options
    )
      .map((res) => extractCategories(res.json()))
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public getFeaturedArticles(): Observable<Article[]> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/article/feature?_format=json', options
    )
      .map((res) => extractArticles(res.json()))
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public getTrendingArticles(): Observable<Article[]> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/article/feature?_format=json', options
    )
      .map((res) => extractArticles(res.json()))
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public getTrendingEvents(): Observable<HyloEvent[]> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/article/trending?_format=json&type=event', options
    )
      .map((res) => extractEvents(res.json()))
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public getTrendingPlaces(): Observable<Company[]> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/trending/place', options
    )
      .map((res) => extractPlaces(res.json()))
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public getEditorsPickArticles(pageNum): Observable<Article[]> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/article/editorpick?_format=json&page=' + pageNum, options
    )
      .map((res) => extractArticles(res.json()))
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public getCommunityArticles(pageNum): Observable<Article[]> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/article?_format=json&filter=latest&limit=8&page=' + pageNum, options
    )
      .map((res) => extractArticles(res.json()))
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public getArticlesCategory(categorySlug, pageNum): Observable<ArticlesCategory> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/article/category/' + categorySlug +
      '?_format=json' +
      '&limit=8' +
      '&page=' + pageNum,
      options
    )
      .map((res) => extractArticlesCategory(res.json()))
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public getRandomPlaces(): Observable<Company[]> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/place_interest/eat-guides', options
    )
      .map((res) => extractPlaces(res.json()))
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public getRandomEvents(): Observable<HyloEvent[]> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/event/random?_format=json', options
    )
      .map((res) => extractEvents(res.json()))
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

}

function extractCategories(response): Category[] {
  const obj = response.data;
  const categories = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const category = obj[key];
      if (!category.hasOwnProperty('children')) {
        category.children = [];
      }
      categories.push(obj[key]);
    }
  }
  return categories;
}

function extractArticles(response): Article[] {
  const articles = [];
  const data = response.data;
  for (const item of data) {
    const article: Article = {
      id: item.nid,
      title: item.title,
      slug: item.alias,
      body: item.body,
      created: item.created,
      field_category: item.field_categories,
      field_images: item.field_images,
      field_places: item.field_places,
      author: extractAuthor(item.user_post)
    };
    articles.push(article);
  }
  return articles;
}

function extractAuthor(userPost): BaseUser {
  return {
    avatar: userPost.user_picture,
    name: userPost.name,
    slug: ''
  };
}

function extractEvents(response): HyloEvent[] {
  const events = [];
  const data = response.data;
  for (const item of data) {
    const event: HyloEvent = {
      id: item.nid,
      name: item.title,
      slug: item.alias,
      creator: null,
      detail: item.body,
      category: item.field_categories,
      startDate: item.field_event_option ? item.field_event_option.field_start_date_time : null,
      endDate: null,
      prices: null,
      organizer: null,
      call2action: item.field_event_option ? {
        id: null,
        link: item.field_event_option.field_call_to_action_link,
        action: MOCK_ACTIONS[item.field_event_option.field_call_to_action_group - 1]
      } : null,
      mentions: null,
      images: item.field_images,
      location: null,
      rating: null,
      userRated: null,
      experiences: null,
      tags: null,
      metaTags: null
    };
    events.push(event);
  }
  return events;
}

function extractPlaces(response): Company[] {
  const places = [];
  const data = response.place.items;
  for (let item of data) {
    const place: Company = {
      id: null,
      name: item.Company_Name,
      description: item.Hylo_Activity_Description,
      rating: item.rating.average,
      location: null,
      website: null,
      phone: null,
      openingHours: null,
      images: extractCompanyImages(item.images),
      instagramUrl: null,
      reviews: null,
      bookmarked: null,
      rated: null,
      CTC: item.CTC,
      Company_Slug: '/company/' + item.Company_Slug,
    };
    places.push(place);
  }
  return places;
}

function extractCompanyImages(data): Image[] {
  const images = [];
  for (let item of data) {
    let image: Image = {
      fid: null,
      url: item,
      value: null,
      filename: null,
      filemime: null,
      filesize: null
    };
    images.push(image);
  }
  return images;
}

function extractArticlesCategory(data): ArticlesCategory {
  return {
    image: data.cat_image,
    description: data.cat_description,
    articles: extractCategoryArticles(data.data)
  };
}

function extractCategoryArticles(data): Article[] {
  const articles = [];
  for (const item of data) {
    const article: Article = {
      id: item.nid,
      title: item.title,
      slug: item.alias,
      body: item.body,
      created: item.created,
      field_category: null,
      field_images: item.field_images,
      field_places: null,
      author: {avatar: null, name: item.user_post.name, slug: null}
    };
    articles.push(article);
  }
  return articles;
}
