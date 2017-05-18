export class AppSetting {
    // public static API_ENDPOINT = 'http://hypeweb.iypuat.com:5656/';
    public static API_LOGIN = 'http://hypeweb.iypuat.com:5656/hylo/fblogin?_format=json';
    public static API_USER_PROFILE = 'http://hypeweb.iypuat.com:5656/api/v1/profile?_format=json';
    public static API_LOGOUT = 'http://hypeweb.iypuat.com:5656/user/logout';
    public static API_LOGIN_STATUS = 'http://hypeweb.iypuat.com:5656/user/login_status?_format=json';
    public static API_USER_FOLLOWING = 'http://hypeweb.iypuat.com:5656/api/user/flag/follow/list?type=following&page=1&limit=10&_format=json';
    public static API_USER_FOLLOWER = 'http://hypeweb.iypuat.com:5656/api/user/flag/follow/list?type=follower&page=1&limit=10&_format=json';
    public static API_USER_INTEREST = 'http://hypeweb.iypuat.com:5656/api/v1/user/interest?_format=json';
    public static FACEBOOK = {
        appId: '289859484806086',
        xfbml: true,
        version: 'v2.9'
    };
}
