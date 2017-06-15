import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';

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
      creator: {
        name: data.user_post.name,
        avatar: data.user_post.user_picture
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
              private _http: Http) {
  }

  public getEventDetail(slugName): Observable<Response> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.get(
      'http://hypeweb.iypuat.com:5656/api/v1/event/' + slugName + '?_format=json', options
    )
    .map((res: Response) => {
      return res.json();
    })
    .catch((error: any) => {
      return Observable.throw(new Error(error.json()));
    });
  }

  public postEvent(data): Observable<Response> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.post(
      'http://hypeweb.iypuat.com:5656/api/v1/event?_format=json',
      data,
      options
    )
    .map((res: Response) => {
      return res.json();
    })
    .catch((error: any) => {
      return Observable.throw(new Error(error.json()));
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
      return Observable.throw(new Error(error.json()));
    });
  }

  public postExperience(eventSlug: string, experience: Experience): Observable<any> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    let data = {
      rate: experience.rating,
      message: experience.text,
      comment_images: experience.images
    };
    return this._http.post(
      'http://hypeweb.iypuat.com:5656/api/v1/comment/' + eventSlug,
      JSON.stringify(data),
      options
    )
    .map((res: Response) => {
      return <Experience> res.json();
    })
    .catch((error: any) => {
      return Observable.throw(new Error(error));
    });
  }

  public postComment(eventSlug: string, comment: HyloComment): Observable<Response> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    let data = {
      pid: comment.pid,
      message: comment.text,
    };
    return this._http.post(
      'http://hypeweb.iypuat.com:5656/api/v1/comment/' + eventSlug,
      JSON.stringify(data),
      options
    )
    .map((res: Response) => {
      return res.json();
    })
    .catch((error: any) => {
      return Observable.throw(new Error(error));
    });
  }

  public toggleLike(comment: HyloComment | Experience): Observable<Response> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    let data = {
      cid: comment.id,
      like: comment.liked
    };
    return this._http.post(
      'http://hypeweb.iypuat.com:5656/api/v1/comment/like',
      JSON.stringify(data),
      options
    )
    .map((res: Response) => {
      return res.json();
    })
    .catch((error: any) => {
      return Observable.throw(new Error(error.json()));
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
        user: {
          name: item.author_name,
          avatar: item.author_avatar,
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
