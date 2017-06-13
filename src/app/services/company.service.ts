import { Injectable } from '@angular/core';
import { Company, Experience, Location } from '../app.interface';
import { LocalStorageService } from 'angular-2-local-storage';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CompanyService {

  public static getMockCompany(): Company {
    return {
      name: 'ABC Restaurant',
      description: 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain ' +
      'was born and I will give you a complete account of the system, and expound the actual teachings of the ' +
      'great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids ' +
      'pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure ' +
      'rationally encounter consequences that are extremely painful. Nor again is there anyone who loves ' +
      'or pursues or desires to obtain pain of itself, because it is pain, but because occasionally ' +
      'circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial ' +
      'example, which of us ever undertakes laborious physical exercise, except to obtain some advantage ' +
      'from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has ' +
      'no annoying consequences, or one who avoids a pain that produces no resultant pleasure?',
      rating: 3.9,
      location: {
        lat: 1.290270,
        lng: 103.851959,
        name: '438 Serangoon Rd, Singapore 218133'
      },
      website: 'https://www.abcrestaurant.com',
      phone: '612345678',
      openingHours: ['(Friday): 8AM -11PM', '(Monday): 8AM -11PM'],
      images: [
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
        {
          url: '/assets/img/event/detail/abc.jpg',
          value: '',
          filename: '',
          filemime: '',
          filesize: 0
        },
      ],
      reviews: [
        {
          id: 0,
          rating: 4,
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
          images: [
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
          ],
          author: {
            name: 'Derek Ang',
            avatar: '/assets/img/event/detail/derek.jpg',
          },
          likeNumber: 22,
          date: 1495238400,
          comments: [],
          liked: false
        },
        {
          id: 0,
          rating: 4,
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
          images: [
            {
              url: '/assets/img/event/detail/abc.jpg',
              value: '',
              filename: '',
              filemime: '',
              filesize: 0
            },
          ],
          author: {
            name: 'Derek Ang',
            avatar: '/assets/img/event/detail/derek.jpg',
          },
          likeNumber: 22,
          date: 1495238400,
          comments: [],
          liked: false
        },
        {
          id: 0,
          rating: 4,
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
          images: [
            {
              url: '/assets/img/event/detail/abc.jpg',
              value: '',
              filename: '',
              filemime: '',
              filesize: 0
            },
          ],
          author: {
            name: 'Derek Ang',
            avatar: '/assets/img/event/detail/derek.jpg',
          },
          likeNumber: 22,
          date: 1495238400,
          comments: [],
          liked: false
        },
        {
          id: 0,
          rating: 4,
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
          images: [
            {
              url: '/assets/img/event/detail/abc.jpg',
              value: '',
              filename: '',
              filemime: '',
              filesize: 0
            },
          ],
          author: {
            name: 'Derek Ang',
            avatar: '/assets/img/event/detail/derek.jpg',
          },
          likeNumber: 22,
          date: 1495238400,
          comments: [],
          liked: false
        },
      ]
    };
  }

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
