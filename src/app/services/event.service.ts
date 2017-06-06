import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';

import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { Experience, HyloComment, HyloEvent, Icon } from '../app.interface';

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
      experiences: extractExperiences(data.comments.data)
    };
  }

  constructor(private _localStorageService: LocalStorageService,
              private _http: Http) {
  }

  public getEventDetail(): Promise<any> {
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.get('http://hypeweb.iypuat.com:5656/api/v1/event/sau-tat-ca?_format=json', options)
      .toPromise()
      .then(
        (resp) => resp.json()
      )
      .catch(handleError);
  }

  public postEvent(data): Promise<any> {
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.post(
      'http://hypeweb.iypuat.com:5656/api/v1/event?_format=json',
      data,
      options)
      .toPromise()
      .then(
        (resp) => resp.json()
      )
      .catch(handleError);
  }

  public getCategoryEvent(): Promise<any> {
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.get('http://hypeweb.iypuat.com:5656/api/v1/category/event?_format=json', options)
      .toPromise()
      .then(
        (resp) => resp.json()
      )
      .catch(handleError);
  }
}

function extractImages(data): string[] {
  let images = [];
  for (let item of data) {
    images.push(item.url);
  }
  return images;
}

function  extractMentions(data): Icon[] {
  let mentions = [];
  for (let item of data) {
    mentions.push(
      {
        url: item.item,
        iconUrl: 'https://www.google.com/s2/favicons?domain=' + item.item,
      }
    );
  }
  return mentions;
}

function  extractExperiences(data): Experience[] {
  let experiences = [];
  for (let item of data) {
    experiences.push(
      {
        author: {
          name: item.author_name,
          avatar: item.author_avatar,
        },
        rating: item.rating,
        date: item.created * 1000,
        text: item.comment_body,
        images: extractImages(item.comment_images),
        comments: extractComments(item.children),
        likeNumber: item.like_comment,
        liked: item.user_like
      }
    );
  }
  return experiences;
}

function  extractComments(data): HyloComment[] {
  let comments = [];
  for (let item of data) {
    comments.push(
      {
        user: {
          name: item.author_name,
          avatar: item.author_avatar,
        },
        text: item.comment_body,
        likeNumber: item.like_comment,
        liked: item.user_like,
        replies: []
      }
    );
  }
  return comments;
}

function  handleError(error: any): Promise<any> {
  return Promise.reject(error.message || error);
}
