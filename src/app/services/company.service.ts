import { Injectable } from '@angular/core';
import { Company, Experience, Location } from '../app.interface';
import { LocalStorageService } from 'angular-2-local-storage';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CompanyService {

  public static extractCompanyDetail(data): Company {
    return {
      name: data.name,
      description: data.description,
      rating: data.rating,
      location: extractLocation(data.location),
      website: data.website,
      phone: data.phone,
      openingHours: [data.Operating_Hours],
      images: getInstagramImages(data.Hylo_Instagram_Link),
      reviews: getReviews(data.review)
    };
  }

  private defaultHeaders = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRF-Token': <string> this._localStorageService.get('csrf_token')
  });

  constructor(private _localStorageService: LocalStorageService,
              private _http: Http) {
  }

  public getCompanyDetail(slugName): Observable<Response> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.get(
      'http://hypeweb.iypuat.com:5656/api/v1/company/detail?key=' + slugName + '&_format=json', options
    )
      .map((res: Response) => {
        return res.json().company;
      })
      .catch((error: any) => {
        return Observable.throw(new Error(error.json()));
      });
  }

  public postReview(companySlug: string, review: Experience): Observable<any> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    let data = {
      rate: review.rating,
      message: review.text,
      comment_images: review.images
    };
    return this._http.post(
      'http://hypeweb.iypuat.com:5656/api/v1/comment/' + companySlug,
      JSON.stringify(data),
      options
    )
      .map((res: Response) => {
        return <Experience> res.json();
      })
      .catch((error: any) => {
        return Observable.throw(new Error(error.json()));
      });
  }

  public toggleLike(review: Experience): Observable<Response> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    let data = {
      cid: review.id,
      like: review.liked
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

function getInstagramImages(link) {
  return [
    {
      url: '/assets/img/event/detail/abc.jpg',
      value: '',
      filename: '',
      filemime: '',
      filesize: 0
    },
    {
      url: '/assets/img/event/detail/abc.jpg',
      value: '',
      filename: '',
      filemime: '',
      filesize: 0
    },
  ];
}

function getReviews(data): Experience[] {
  let results = data.results;
  let reviews: Experience[] = [];
  for (let r of results) {
    let review: Experience = {
      id: r.idsno,
      author: {
        name: r.user.name,
        avatar: r.user.avatar
      },
      rating: r.rate,
      date: r.created,
      text: r.body,
      images: extractImages(r.image),
      comments: [],
      likeNumber: 0,
      liked: false
    };
    reviews.push(review);
  }
  return reviews;
}

function extractImages(data) {
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
