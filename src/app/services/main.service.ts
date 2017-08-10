import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { AppSetting } from '../app.setting';
import { LocalStorageService } from 'angular-2-local-storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MainService {
  private defaultHeaders = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRF-Token': this.localStorageService.get('csrf_token')
  });

  public constructor(private localStorageService: LocalStorageService,
                     private http: Http) {
  }

  public getArticle(slugName): Observable<any> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/article/' + slugName + '?_format=json', options
    ).map((res) => {
      return res.json();
    })
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public getCategoryArticle(): Observable<Response> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/category/article/?_format=json', options
    )
      .map((res) => {
        return res.json();
      })
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public getCategoryTreeArticle(): Observable<Response> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/category/tree/?_format=json', options
    )
    .map((res) => {
      return res.json();
    })
    .catch((error) => {
      return Observable.throw(new Error(error));
    });
  }

  public getCurate(filter, cate, page, limit): Observable<Response> {
    let headers = this.defaultHeaders;
    let searchParams = new URLSearchParams();
    searchParams.set('_format', 'json');
    searchParams.set('filter', filter);
    if (limit) {
      searchParams.set('limit', limit);
    }
    if (page) {
      searchParams.set('page', page);
    }
    if (parseInt(cate, 10)) {
      searchParams.set('cate', cate);
    }

    let options = new RequestOptions({
      headers,
      params: searchParams,
      withCredentials: true
    });

    return this.http.get(AppSetting.API_ENDPOINT + 'api/v1/article', options)
      .map((res) => {
        return res.json();
      })
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public getCurateTrending(): Observable<any> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(AppSetting.API_ENDPOINT + 'api/v1/toparticle?_format=json', options)
      .map((res) => {
        return res.json();
      })
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public postArticle(data): Observable<any> {
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.post(
      AppSetting.API_ENDPOINT + 'api/v1/article?_format=json',
      data, options
    )
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public updateArticle(data): Observable<any> {
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.patch(
      AppSetting.API_ENDPOINT + 'api/v1/article?_format=json',
      data, options
    )
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public getNotifications(user: number, page: number): Observable<any> {
    let csrfToken = this.localStorageService.get('csrf_token');
    // let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let headers = new Headers({'Content-Type': 'application/json'});
    // let options = new RequestOptions({headers, withCredentials: true});
    let options = new RequestOptions({headers});
    return this.http.get(
      AppSetting.NODE_SERVER + '/api/v1/notification/' + user + '/' + page
    )
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public updateNotifications(uid: number, notificationId?: number): Observable<any> {
    // let csrfToken = this.localStorageService.get('csrf_token');
    // let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    // let options = new RequestOptions({headers, withCredentials: true});
    let uri = AppSetting.NODE_SERVER + '/api/v1/notification/' + uid;
    if (notificationId) {
      uri = AppSetting.NODE_SERVER + '/api/v1/notification/' + notificationId + '/' + uid;
    }
    return this.http.post(uri, '').map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public favoritePlace(idsNo: string): Observable<any> {
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.post(AppSetting.API_ENDPOINT + 'api/v1/favorite/place',
      JSON.stringify({ids_no: idsNo}), options
    )
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public search(keyword: string): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/suggestion/' + keyword, options
    )
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public searchCompany(keyword: string): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers});
    return this.http.get(AppSetting.API_ENDPOINT + 'api/v1/company/suggestion/' + keyword, options)
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public searchResult(keywords: string): Observable<any> {
    // request header
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers});

    // fake data
    let fakeData = JSON.parse(`
      {"article":[{"id":"480","Title":"4 Artisan Florists To Buy Your Flowers From This Valentines Day","Address":"With Every Bloom","Long":"103.902570","Lat":"1.309242","Code":"Article","Entity_Id":"480","Slug":"/article/4-artisan-florists-buy-your-flowers-valentines-day","images":"https://hylowebsite.s3.amazonaws.com/avatar/styles/140x140/s3/2017-07/cover_8.png?itok=eMMcE6aC","alias":"/article/4-artisan-florists-buy-your-flowers-valentines-day"},{"id":"472","Title":"Best Of Music And Food: Events In Singapore To Look Forward To For The Rest Of 2017","Address":"Singapore Food Expo","Long":"103.959537","Lat":"1.333525","Code":"Article","Entity_Id":"472","Slug":"/article/best-music-and-food-events-singapore-look-forward-rest-2017","images":"https://hylowebsite.s3.amazonaws.com/avatar/styles/140x140/s3/2017-07/cover_5.jpg?itok=kueS_ViC","alias":"/article/best-music-and-food-events-singapore-look-forward-rest-2017"},{"id":"483","Title":"Here Are Five Food Festivals You Can Look Forward To!","Address":"World Snack Fair","Long":"103.857279","Lat":"1.293685","Code":"Article","Entity_Id":"483","Slug":"/article/here-are-five-food-festivals-you-can-look-forward","images":"https://hylowebsite.s3.amazonaws.com/avatar/styles/140x140/s3/2017-07/cover_food_festival.jpg?itok=BjBmgcrA","alias":"/article/here-are-five-food-festivals-you-can-look-forward"}],"event":[{"id":"594","Title":"Event 23345","Address":"Creative Art Trove (Art Classes)","Long":"0","Lat":"0","Code":"Event","Entity_Id":"594","Slug":"/node/594","images":"https://hylowebsite.s3.amazonaws.com/avatar/styles/140x140/s3/15022749841-3c6d6.jpg?itok=6aAswlkM","alias":"/event/event-23345"},{"id":"593","Title":"Event for to day  ","Address":"Art Monde","Long":"0","Lat":"0","Code":"Event","Entity_Id":"593","Slug":"/node/593","images":"https://hylowebsite.s3.amazonaws.com/avatar/styles/140x140/s3/1502273575me-man-anh-dep-tuyet-my-cua-cho-trong-vuon-hoa-hinh-3.jpg?itok=8fyVbWub","alias":"/event/event-day"},{"id":"584","Title":"Event số 2","Address":"One-Hub Services Pte. Ltd.","Long":"103.840712","Lat":"1.301878","Code":"Event","Entity_Id":"584","Slug":"/event/event-so-2","images":"https://hylowebsite.s3.amazonaws.com/avatar/styles/140x140/s3/15021902449d4up.jpg?itok=uu__FcKg","alias":"/event/event-so-2"},{"id":"576","Title":"Share An Event","Address":"Song Ktv Pte. Ltd.","Long":"103.84826","Lat":"1.28145","Code":"Event","Entity_Id":"576","Slug":"/event/share-event-2","images":"https://hylowebsite.s3.amazonaws.com/avatar/styles/140x140/s3/1502112134tv.png?itok=BrH74b9o","alias":"/event/share-event-2"},{"id":"577","Title":"Share An Event","Address":"Ng Ba Bi","Long":"103.775979","Lat":"1.343032","Code":"Event","Entity_Id":"577","Slug":"/event/share-event-3","images":"https://hylowebsite.s3.amazonaws.com/avatar/styles/140x140/s3/1502160815tv.png?itok=PxBW_nZl","alias":"/event/share-event-3"}],"company":[{"id":"600330d8199140585931496d1758cd22","Address":"Blk 153 Serangoon Nth Ave 1 #01-536  Singapore 550153","Long":"103.872013","Lat":"1.370146","Code":"Company","Title":"Everspring Foot Reflexology Centre","Slug":"everspring-foot-reflexology-centre"},{"id":"70458f46c7f5a231f12321a5feb79a1b","Address":"Blk 94 Lor 4 Toa Payoh #01-42  Singapore 310094","Long":"103.849315","Lat":"1.339066","Code":"Company","Title":"Everyday Spa","Slug":"everyday-spa"},{"id":"8951c163f153fad5f6ad668c2454e83a","Address":"Block 2, Everton Park, #01-47, Singapore 081002","Long":" ","Lat":" ","Code":"Company","Title":"Artsyfact","Slug":"artsyfact"},{"id":"153fdf05d0952de5949515f947627646","Address":"Level 2, 131 Devonshire Road (S)239887, Singapore 239887","Long":" ","Lat":" ","Code":"Company","Title":"Asian Art Options","Slug":"asian-art-options"},{"id":"01deda104466d173a69e2f16f2d60953","Address":"Blk 6 Everton Pk #01-14  Singapore 080006","Long":"103.838734","Lat":"1.276589","Code":"Company","Title":"Bien Etre Blind Massage","Slug":"bien-etre-blind-massage"}]}
    `);

    console.log('searchResult: ', keywords);

    return this.http.get('', options)
      // .map(resp => resp.json())
      .map(resp => fakeData)
      .catch(error => Observable.throw(new Error(error)));
  }
}
