let _ENV = process.env.NODE_ENV || process.env.ENV || 'product';
let PAGE_SIZE = 10;
let FOLLOW_PAGE_SIZE = 60;
let INTERVAL_NOTIFIATION = 1000;
let API_ENDPOINT = '';
let NODE_JS = '';

if (_ENV === 'development') {
  API_ENDPOINT = 'http://dev-hylo.iypuat.com:5656/';
  NODE_JS = 'http://52.220.246.146:8000';
} else {
  API_ENDPOINT = 'http://dev-hylo.iypuat.com:5656/';
  NODE_JS = 'http://52.220.246.146:8000';
}

console.log('current API: ', API_ENDPOINT);

const API_FOLLOW = API_ENDPOINT + 'api/user/flag/follow';

export class AppSetting {
  public static API_ENDPOINT = API_ENDPOINT;
    public static NODE_SERVER = NODE_JS;
  public static API_LOGIN = API_ENDPOINT + 'hylo/fblogin?_format=json';
  public static API_USER_PROFILE = API_ENDPOINT + 'api/v1/profile/';
  public static API_LOGOUT = API_ENDPOINT + 'api/user/logout?_format=json';
  public static API_LOGIN_STATUS = API_ENDPOINT + 'user/login_status?_format=json';
  public static API_USER_FOLLOWING = API_FOLLOW +
    '/list?_format=hal_json&limit=' + FOLLOW_PAGE_SIZE + '&type=following';
  public static API_USER_FOLLOWER = API_FOLLOW +
    '/list?_format=hal_json&limit=' + FOLLOW_PAGE_SIZE + '&type=follower';
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
  public static API_COMPANY_SEARCH = API_ENDPOINT + 'api/v1/company/suggestion/';
  public static INSTAGRAM_ACCESS_TOKEN = '1175510051.4e32184.4c50556a3ebe4cf5bd18ecfa9a12ebc1';
  public static FACEBOOK = {
    appId: '289859484806086',
    xfbml: true,
    version: 'v2.9'
  };

  public static MobileSize = {
      mobile_p: 545,
      mobile_l: 768,
      tab_mii: 992
  };
  public static PAGE_SIZE: number = PAGE_SIZE;
  public static FOLLOW_PAGE_SIZE: number = FOLLOW_PAGE_SIZE;
  public static INTERVAL_NOTIFIATION: number = INTERVAL_NOTIFIATION;
  public static GMAP_STYLE = [
    {
   featureType: 'all',
   elementType: 'labels',
   stylers: [
        {
       visibility: 'off'
        }
      ]
    },
    {
   featureType: 'administrative',
   elementType: 'all',
   stylers: [
        {
       visibility: 'simplified'
        },
        {
       color: '#5b6571'
        },
        {
       lightness: '35'
        }
      ]
    },
    {
   featureType: 'administrative',
   elementType: 'labels',
   stylers: [
        {
       visibility: 'simplified'
        },
        {
       weight: '3.73'
        }
      ]
    },
    {
   featureType: 'administrative',
   elementType: 'labels.text.fill',
   stylers: [
        {
       color: '#844900'
        }
      ]
    },
    {
   featureType: 'administrative.country',
   elementType: 'labels',
   stylers: [
        {
       visibility: 'off'
        },
        {
       weight: '0.01'
        },
        {
       lightness: '15'
        }
      ]
    },
    {
   featureType: 'administrative.country',
   elementType: 'labels.text',
   stylers: [
        {
       visibility: 'off'
        }
      ]
    },
    {
   featureType: 'administrative.neighborhood',
   elementType: 'all',
   stylers: [
        {
       visibility: 'off'
        }
      ]
    },
    {
   featureType: 'administrative.neighborhood',
   elementType: 'labels',
   stylers: [
        {
       visibility: 'on'
        }
      ]
    },
    {
   featureType: 'administrative.neighborhood',
   elementType: 'labels.text',
   stylers: [
        {
       color: '#835b00'
        }
      ]
    },
    {
   featureType: 'administrative.neighborhood',
   elementType: 'labels.text.fill',
   stylers: [
        {
       visibility: 'simplified'
        },
        {
       color: '#a46c00'
        }
      ]
    },
    {
   featureType: 'landscape',
   elementType: 'all',
   stylers: [
        {
       visibility: 'on'
        },
        {
       color: '#f3f4f4'
        }
      ]
    },
    {
   featureType: 'landscape',
   elementType: 'labels',
   stylers: [
        {
       visibility: 'on'
        }
      ]
    },
    {
   featureType: 'landscape.man_made',
   elementType: 'geometry',
   stylers: [
        {
       weight: 0.9
        },
        {
       visibility: 'off'
        }
      ]
    },
    {
   featureType: 'poi',
   elementType: 'labels',
   stylers: [
        {
       visibility: 'on'
        }
      ]
    },
    {
   featureType: 'poi.park',
   elementType: 'geometry.fill',
   stylers: [
        {
       visibility: 'on'
        },
        {
       color: '#83cead'
        }
      ]
    },
    {
   featureType: 'road',
   elementType: 'all',
   stylers: [
        {
       visibility: 'on'
        },
        {
       color: '#ffffff'
        }
      ]
    },
    {
   featureType: 'road',
   elementType: 'labels',
   stylers: [
        {
       visibility: 'on'
        }
      ]
    },
    {
   featureType: 'road.highway',
   elementType: 'all',
   stylers: [
        {
       visibility: 'on'
        },
        {
       color: '#fee379'
        }
      ]
    },
    {
   featureType: 'road.highway',
   elementType: 'geometry',
   stylers: [
        {
       visibility: 'on'
        }
      ]
    },
    {
   featureType: 'road.highway',
   elementType: 'labels',
   stylers: [
        {
       visibility: 'off'
        }
      ]
    },
    {
   featureType: 'road.highway',
   elementType: 'labels.icon',
   stylers: [
        {
       visibility: 'off'
        }
      ]
    },
    {
   featureType: 'road.highway.controlled_access',
   elementType: 'labels.icon',
   stylers: [
        {
       visibility: 'off'
        }
      ]
    },
    {
   featureType: 'road.arterial',
   elementType: 'all',
   stylers: [
        {
       visibility: 'simplified'
        },
        {
       color: '#ffffff'
        }
      ]
    },
    {
   featureType: 'road.arterial',
   elementType: 'labels',
   stylers: [
        {
       visibility: 'off'
        }
      ]
    },
    {
   featureType: 'road.arterial',
   elementType: 'labels.icon',
   stylers: [
        {
       visibility: 'off'
        }
      ]
    },
    {
   featureType: 'road.local',
   elementType: 'labels',
   stylers: [
        {
       visibility: 'on'
        }
      ]
    },
    {
   featureType: 'road.local',
   elementType: 'labels.text',
   stylers: [
        {
       visibility: 'on'
        }
      ]
    },
    {
   featureType: 'transit',
   elementType: 'labels',
   stylers: [
        {
       visibility: 'on'
        }
      ]
    },
    {
   featureType: 'water',
   elementType: 'all',
   stylers: [
        {
       visibility: 'on'
        },
        {
       color: '#7fc8ed'
        }
      ]
    }
  ];
}
