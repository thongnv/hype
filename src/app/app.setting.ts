let _ENV = 'product';
let API_ENDPOINT = '';
if (_ENV === 'develop') {
  API_ENDPOINT = 'http://hylo.dev/';
} else {
  API_ENDPOINT = 'http://hypeweb.iypuat.com:5656/';
}

const API_FOLLOW = API_ENDPOINT + 'api/user/flag/follow';

export class AppSetting {
  public static API_LOGIN = API_ENDPOINT + 'hylo/fblogin?_format=json';
  public static API_USER_PROFILE = API_ENDPOINT + 'api/v1/profile/';
  public static API_LOGOUT = API_ENDPOINT + 'api/user/logout?_format=json';
  public static API_LOGIN_STATUS = API_ENDPOINT + 'user/login_status?_format=json';
  public static API_USER_FOLLOWING = API_FOLLOW + '/list?_format=hal_json&limit=10&type=following';
  public static API_USER_FOLLOWER = API_FOLLOW + '/list?_format=hal_json&limit=10&type=follower';
  public static API_USER_UNFOLLOW = API_FOLLOW + '?_format=json';
  public static API_USER_INTEREST = API_ENDPOINT + 'api/v1/user/interest?_format=json';
  public static API_USER_ACTIVITY = API_ENDPOINT + '/api/v1/user/activity?_format=json';
  public static API_ARTICLE = API_ENDPOINT + '/articles?_format=json';
  public static API_ENDPOINT_DEMO = 'http://hylo.dev/' + '/assets/mock-data/mock-data.json';
  public static FACEBOOK = {
    appId: '289859484806086',
    xfbml: true,
    version: 'v2.9'
  };
}
