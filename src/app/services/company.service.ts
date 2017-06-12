import { Injectable } from '@angular/core';
import { Company, Experience } from '../app.interface';
import { LocalStorageService } from 'angular-2-local-storage';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CompanyService {

  private defaultHeaders = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRF-Token': <string> this._localStorageService.get('csrf_token')
  });

  constructor(private _localStorageService: LocalStorageService,
              private _http: Http) {
  }

  public getEventCompanyDetail(slugName): Observable<Response> {
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

  public getCompany(companyID: string): Company {
    return {
      name: 'ABC Restaurant',
      description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium ' +
      'voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate ' +
      'non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum ' +
      'fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis ' +
      'est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas ' +
      'assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum ' +
      'necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque ' +
      'earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur ' +
      'aut perferendis doloribus asperiores repellat.',
      rating: 3.9,
      location: {
        lat: 1.290270,
        lng: 103.851959,
        name: '438 Serangoon Rd, Singapore 218133'
      },
      website: 'https://www.abcrestaurant.com',
      phone: '612345678',
      openingHours: [
        '(Monday): 8AM -11PM',
        '(Tuesday): 8AM -11PM',
        '(Wednesday): 8AM -11PM',
        '(Thursday): 8AM -11PM',
        '(Friday): 8AM -11PM',
        '(Saturday): 8AM -01PM'
      ],
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
            }
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
            }
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
            }
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
            }
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
}
