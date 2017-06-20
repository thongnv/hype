let _ENV = 'product';
let PAGE_SIZE = 10;
let FAVORITE_PAGE_SIZE = 50;
let INTERVAL_NOTIFIATION = 1000;
let API_ENDPOINT = '';
if (_ENV === 'develop') {
  API_ENDPOINT = 'http://hypeweb.iypuat.com:5656/';
} else {
  API_ENDPOINT = 'http://hypeweb.iypuat.com:5656/';
}

const API_FOLLOW = API_ENDPOINT + 'api/user/flag/follow';

export class AppSetting {
  public static API_ENDPOINT = API_ENDPOINT;
  public static API_LOGIN = API_ENDPOINT + 'hylo/fblogin?_format=json';
  public static API_USER_PROFILE = API_ENDPOINT + 'api/v1/profile/';
  public static API_LOGOUT = API_ENDPOINT + 'api/user/logout?_format=json';
  public static API_LOGIN_STATUS = API_ENDPOINT + 'user/login_status?_format=json';
  public static API_USER_FOLLOWING = API_FOLLOW +
    '/list?_format=hal_json&limit=' + FAVORITE_PAGE_SIZE + '&type=following';
  public static API_USER_FOLLOWER = API_FOLLOW +
    '/list?_format=hal_json&limit=' + FAVORITE_PAGE_SIZE + '&type=follower';
  public static API_USER_UNFOLLOW = API_FOLLOW + '?_format=json';
  public static API_USER_INTEREST = API_ENDPOINT + 'api/v1/user/interest/';
  public static API_USER_ACTIVITY = API_ENDPOINT + 'api/v1/user/activity?_format=json';
  public static API_ARTICLE = API_ENDPOINT + 'api/v1/article';
  public static API_CURATE_TRENDING = API_ENDPOINT + 'api/v1/toparticle';
  public static API_CATEGORIES_ARTICLE = API_ENDPOINT + 'api/v1/category/article/?_format=json';
  public static API_CATEGORIES_EVENT = API_ENDPOINT + 'api/v1/category/event/?_format=json';
  public static API_ENDPOINT_DEMO = 'http://hylo.dev:8000/assets/mock-data/mock-data.json';
  public static API_ENDPOINT_LIKE = API_ENDPOINT + 'api/user/flag/bookmark?_format=json';
  public static API_ENDPOINT_CAT_MODE = API_ENDPOINT + 'api/v1/category/mode?_format=json';
  public static API_ENDPOINT_MODE = API_ENDPOINT + 'api/v1/place/search';
  public static API_ENDPOINT_TOP = API_ENDPOINT + 'api/v1/top?_format=json';

  public static API_TRENDING = API_ENDPOINT + 'api/v1/home/search';
  public static API_NOTIFICATION = API_ENDPOINT + 'api/v1/notify?_format=json';
  public static API_USER_PUBLIC_PROFILE = API_ENDPOINT + 'api/v1/profile/';
  public static API_FAVORITE_PLACE = API_ENDPOINT + 'api/v1/favorite/place';
  public static API_FAVORITE_EVENT_LIST = API_ENDPOINT + 'api/user/flag/bookmark/list';
  public static API_UNFAVORITE_EVENT_LIST = API_ENDPOINT + 'api/user/flag/bookmark';
  public static API_SEARCH = API_ENDPOINT + 'api/v1/suggestion/';
  public static FACEBOOK = {
    appId: '289859484806086',
    xfbml: true,
    version: 'v2.9'
  };
  public static PAGE_SIZE: number = PAGE_SIZE;
  public static FAVORITE_PAGE_SIZE: number = PAGE_SIZE;
  public static INTERVAL_NOTIFIATION: number = INTERVAL_NOTIFIATION;
}
