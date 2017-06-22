import { Injectable } from '@angular/core';
import { Company, Experience, Image, Location } from '../app.interface';
import { LocalStorageService } from 'angular-2-local-storage';
import { Http, Headers, RequestOptions, Response, Jsonp } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppSetting } from '../app.setting';
import { Router } from '@angular/router';

@Injectable()
export class CompanyService {

  public static extractCompanyDetail(data): Company {
    return {
      id: data.ids_no,
      name: data.name,
      description: data.description,
      rating: data.rating,
      rated: Boolean(data.is_rated),
      bookmarked: Boolean(data.is_favorite),
      location: extractLocation(data.location),
      website: data.website,
      phone: data.phone,
      openingHours: [],
      images: [],
      instagramUrl: data.Hylo_Instagram,
      reviews: getReviews(data.review)
    };
  }

  private defaultHeaders = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRF-Token': <string> this._localStorageService.get('csrf_token')
  });

  constructor(private _localStorageService: LocalStorageService,
              private _http: Http,
              private router: Router,
              private _jsonp: Jsonp) {
  }

  public getCompanyDetail(slugName): Observable<Company> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.get(
      AppSetting.API_ENDPOINT + 'api/v1/company/detail?_format=json&key=' + slugName, options
    )
      .map((res: Response) => {
        return res.json().company;
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

  public getInstagramProfile(username) {
    return this._jsonp.get(
      'https://api.instagram.com/v1/users/search' +
      '?q=' + username +
      '&access_token=' + AppSetting.INSTAGRAM_ACCESS_TOKEN +
      '&callback=JSONP_CALLBACK')
      .map((res) => res.json())
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public getInstagramImages(userId: string): Observable<any> {
    return this._jsonp.get(
      'https://api.instagram.com/v1/users/' + userId + '/media/recent/' +
      '?access_token=' + AppSetting.INSTAGRAM_ACCESS_TOKEN +
      '&callback=JSONP_CALLBACK')
        .map((res: Response) => res.json())
        .catch((error: any) => {
          return Observable.throw(new Error(error));
        });
    }

  public toggleBookmark(placeId: string): Observable<any> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    let data = {ids_no: placeId};
    return this._http.post(
      AppSetting.API_ENDPOINT + 'api/v1/favorite/place',
      JSON.stringify(data), options
    ).map((res: Response) => {
      return <Experience> res.json();
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

  public postReview(placeId: string, review: Experience): Observable<Experience> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    let data = {
      idsno: placeId,
      rate: review.rating,
      body: review.text,
      images: review.images
    };
    return this._http.post(
      AppSetting.API_ENDPOINT + 'api/user/review/place',
      JSON.stringify(data), options
    )
      .map((res: Response) => {
        let respData = res.json().comment.results[0];
        review.id = respData.rid;
        review.images = extractImages(respData.image);
        return review;
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

  public toggleLike(review: Experience): Observable<boolean> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    let data = {
      id: review.id
    };
    return this._http.post(
      AppSetting.API_ENDPOINT + 'api/v1/company/review/like',
      JSON.stringify(data), options
    )
      .map((res: Response) => {
        return Boolean(res.json().is_liked);
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
}

function extractLocation(location): Location {
  let address = location[0];
  let lat = location[6];
  let lng = location[5];
  return {
    name: address.replace('Address/Fax ', ''),
    lat: Number(lat.replace('Lat/', '')),
    lng: Number(lng.replace('Long/', ''))
  };
}

function getReviews(data): Experience[] {
  let results = data.results;
  let reviews: Experience[] = [];
  for (let r of results) {
    let review: Experience = {
      id: r.rid,
      author: {
        name: r.user.name,
        avatar: r.user.avatar,
        slug: ''
      },
      rating: r.rate,
      date: Number(r.created) * 1000,
      text: r.body,
      images: extractImages(r.image),
      comments: [],
      likeNumber: Number(r.number_like),
      liked: Boolean(r.is_like_flag)
    };
    reviews.push(review);
  }
  return reviews;
}

function extractImages(data): Image[] {
  if (!data) {
    return [];
  }
  let images = [];
  for (let item of data) {
    images.push(
      {
        url: item,
        value: '',
        filename: '',
        filemime: '',
        filesize: 0,
      }
    );
  }
  return images;
}
