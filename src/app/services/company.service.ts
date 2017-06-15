import { Injectable } from '@angular/core';
import { Company, Experience, Image, Location } from '../app.interface';
import { LocalStorageService } from 'angular-2-local-storage';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

let mockData = {
  is_favorite: 1,
  ids_no: '46001',
  name: 'Science Centre Singapore',
  slug: 'science-centre-singapore',
  logo: '',
  description: '',
  rating: 2.5,
  rated: false,
  total_rate: '1',
  location: [
    'Address/Fax  15 Science Centre Rd  Science Centre Bldg Singapore 609081',
    'Postal_Code/609081',
    'Telephone/ ',
    'Seq/000',
    'Location/Jurong East',
    'Long/103.735258',
    'Lat/1.333498'
  ],
  website: '',
  phone: '',
  Operating_Hours: 'Science Centre SingaporeDaily: 10 am - 6 pm Last admission to Science Centre: 5.15 pmThe ' +
  'Observatory\ufffdlt;br>Every Friday(Closed on Public Holidays): 7.45\ufffdm-\ufffd0 pmKidsSTOPEveryday ' +
  '(Mon - Sun and Public Holidays)1st Session: 9.30am - 1.30 pm (Last admission: 12.45 pm)2nd ' +
  'Session: 2pm - 6 pm (Last admission: 5.15pm)',
  Hylo_Instagram: 'https://www.instagram.com/sciencecentresg/',
  Hylo_Instagram_Link: 'https://www.instagram.com/explore/tags/sciencecentresg?__a=1',
  review: {
    total: '1',
    results: [
      {
        rid: '1',
        idsno: '46001',
        created: '1497322682',
        body: '',
        rate: 2.5,
        image: [
          '/assets/img/event/detail/abc.jpg',
          '/assets/img/event/detail/abc.jpg'
        ],
        number_like: '1',
        is_like_flag: 1,
        user: {
          name: 'cadic',
          uid: '3',
          slug: '/user/cadic',
          avatar: ''
        }
      }
    ]
  }
};

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
      openingHours: extractOpeningHours(data.Operating_Hours),
      images: getInstagramImages(data.images),
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

  public postReview(placeId: string, review: Experience): Observable<any> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    let data = {
      idsno: placeId,
      rate: review.rating,
      body: review.text,
      images: review.images
    };
    return this._http.post(
      'http://hypeweb.iypuat.com:5656/api/user/review/place',
      JSON.stringify(data), options
    ).map((res: Response) => {
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

function extractOpeningHours(data) {
  return [];
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

function getInstagramImages(data): Image[] {
  let images = [];
  for (let item of data) {
    images.push({
      url: item.standard_resolution,
      value: '',
      filename: '',
      filemime: '',
      filesize: 0
    });
  }
  return images;
}

function getReviews(data): Experience[] {
  let results = data.results;
  let reviews: Experience[] = [];
  for (let r of results) {
    let review: Experience = {
      id: r.id,
      author: {
        name: r.user.name,
        avatar: r.user.avatar
      },
      rating: r.rate,
      date: Number(r.created) * 1000,
      text: r.body,
      images: extractImages(r.image),
      comments: [],
      likeNumber: Number(r.number_like),
      liked: Boolean(data.is_like_flag)
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
