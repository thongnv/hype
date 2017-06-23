import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

import { Experience, HyloComment, HyloEvent, Icon, Image } from '../app.interface';
import { AppSetting } from '../app.setting';

let MOCK_ACTIONS = [
  'Buy Tickets',
  'Special Order'
];

@Injectable()
export class EventService {

  public static extractEventDetail(data): HyloEvent {
    return {
      id: data.nid,
      creator: {
        name: data.user_post.name,
        avatar: data.user_post.user_picture,
        slug: data.user_post.slug.replace('/user/', '')
      },
      images: extractImages(data.field_image),
      detail: data.body,
      date: data.created * 1000,
      category: data.field_category,
      location: {
        name: data.field_location_place.field_location_address,
        lat: Number(data.field_location_place.field_latitude),
        lng: Number(data.field_location_place.field_longitude)
      },
      name: data.title,
      price: data.field_event_option.field_price,
      call2action: {
        link: data.field_event_option.field_call_to_action_link,
        action: MOCK_ACTIONS[data.field_event_option.field_call_to_action_group - 1]
      },
      mentions: extractMentions(data.field_event_option.field_mentioned_by),
      rating: data.average_rating,
      userRated: data.user_vote,
      experiences: extractExperiences(data.comments.data)
    };
  }

  private defaultHeaders = new Headers({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-CSRF-Token': <string> this._localStorageService.get('csrf_token')});

  constructor(private _localStorageService: LocalStorageService,
              private _http: Http, private router: Router) {
  }

  public getEventDetail(slugName): Observable<Response> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.get(
      AppSetting.API_ENDPOINT + 'api/v1/event/' + slugName + '?_format=json', options
    )
    .map((res: Response) => {
      return res.json();
    })
      .catch((error: any) => {
        if (error.status === 404) {
          this.router.navigate(['404'], {skipLocationChange: true}).then();
        }
        if (error.status === 500) {
          this.router.navigate(['500'], {skipLocationChange: true}).then();
        }
        return Observable.throw(new Error(error));
      });
  }

  public postEvent(data): Observable<Response> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.post(
      AppSetting.API_ENDPOINT + 'api/v1/event?_format=json',
      data,
      options
    )
    .map((res: Response) => {
      return res.json();
    })
      .catch((error: any) => {
        if (error.status === 404) {
          this.router.navigate(['404'], {skipLocationChange: true}).then();
        }
        if (error.status === 500) {
          this.router.navigate(['500'], {skipLocationChange: true}).then();
        }
        return Observable.throw(new Error(error));
    });
  }

  public getCategoryEvent(): Observable<Response> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.get(
      AppSetting.API_CATEGORIES_EVENT, options
    )
    .map((res: Response) => {
      return res.json();
    })
      .catch((error: any) => {
        if (error.status === 404) {
          this.router.navigate(['404'], {skipLocationChange: true}).then();
        }
        if (error.status === 500) {
          this.router.navigate(['500'], {skipLocationChange: true}).then();
        }
        return Observable.throw(new Error(error));
    });
  }

  public postExperience(eventSlug: string, data): Observable<Experience> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.post(
      AppSetting.API_ENDPOINT + 'api/v1/comment/' + eventSlug,
      JSON.stringify(data), options
    )
    .map((res: Response) => {
      let resData = res.json().data;
      return {
        id: resData.cid,
        author: {avatar: resData.author_avatar, name: resData.author_name},
        text: resData.comment_body,
        likeNumber: 0,
        liked: false,
        comments: [],
        rating: resData.rating,
        date: resData.created * 1000,
        images: extractImages(resData.comment_images)
      };
    })
      .catch((error: any) => {
        if (error.status === 403) {
          this.router.navigate(['login'], {skipLocationChange: true}).then();
        }
        return Observable.throw(new Error(error));
    });
  }

  public postComment(eventSlug: string, data): Observable<HyloComment> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.post(
      AppSetting.API_ENDPOINT + 'api/v1/comment/' + eventSlug,
      JSON.stringify(data),
      options
    )
    .map((res: Response) => {
      let d = res.json().data;
      return {
        id: d.cid,
        pid: d.pid,
        author: {name: d.author_name, avatar: d.author_avatar},
        text: d.comment_body,
        likeNumber: 0,
        liked: false,
        replies: []
      };
    })
      .catch((error: any) => {
        if (error.status === 403) {
          this.router.navigate(['login'], {skipLocationChange: true}).then();
        }
        return Observable.throw(new Error(error));
    });
  }

  public toggleLike(nid, cid, like): Observable<Response> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    let data = {nid, cid, like};
    return this._http.post(
      AppSetting.API_ENDPOINT + 'api/v1/comment/like',
      JSON.stringify(data), options
    )
      .map((res: Response) => res.json())
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }
}

function extractImages(data): Image[] {
  if (!data) {
    return [];
  }
  let images = [];
  for (let item of data) {
    images.push(
      {
        url: item.url,
        value: '',
        filename: '',
        filemime: '',
        filesize: '',
      }
    );
  }
  return images;
}

function extractMentions(data): Icon[] {
  let mentions = [];
  for (let item of data) {
    mentions.push(
      {
        url: item,
        iconUrl: 'https://www.google.com/s2/favicons?domain=' + item
      }
    );
  }
  return mentions;
}

function extractExperiences(data): Experience[] {
  let experiences = [];
  for (let item of data) {
    experiences.push(
      {
        id: item.cid,
        author: {
          name: item.author_name,
          avatar: item.author_avatar,
        },
        rating: item.rating,
        date: item.created * 1000,
        text: item.comment_body,
        images: extractImages(item.comment_images),
        comments: extractComments(item.children),
        likeNumber: Number(item.like_comment),
        liked: item.user_like
      }
    );
  }
  return experiences;
}

function extractComments(data): HyloComment[] {
  let comments: HyloComment[] = [];
  for (let item of data) {
    comments.push(
      {
        id: item.cid,
        pid: item.pid,
        author: {
          name: item.author_name,
          avatar: item.author_avatar,
          slug: ''
        },
        text: item.comment_body,
        likeNumber: Number(item.like_comment),
        liked: item.user_like,
        replies: []
      }
    );
  }
  return comments;
}
