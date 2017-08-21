import { User } from './app.interface';
let _ENV = process.env.NODE_ENV || process.env.ENV || 'product';
let PAGE_SIZE = 10;
let API_ENDPOINT = '';
let NODE_JS = '';

if (_ENV === 'development') {
  API_ENDPOINT = 'http://hypeweb.iypuat.com:5656/';
  NODE_JS = 'http://192.168.35.56:9696';
} else {
  API_ENDPOINT = 'http://hypeweb.iypuat.com:5656/';
  NODE_JS = 'http://192.168.35.56:9696';

  // API_ENDPOINT = 'https://api-hl.iypuat.com/';
  // NODE_JS = 'https://hylo2.iypuat.com:8080';
}

export class AppSetting {
  public static API_ENDPOINT = API_ENDPOINT;
  public static NODE_SERVER = NODE_JS;
  public static API_LOGIN = API_ENDPOINT + 'hylo/fblogin?_format=json';
  public static API_CATEGORIES_EVENT = API_ENDPOINT + 'api/v1/category/event/?_format=json';
  public static API_TAGS_EVENT = API_ENDPOINT + 'api/v1/category/tags/?_format=json';
  public static API_ENDPOINT_CAT_MODE = API_ENDPOINT + 'api/v1/category/mode?_format=json';
  public static API_ENDPOINT_MODE = API_ENDPOINT + 'api/v1/place/search';
  public static API_SEARCH_RESULT = API_ENDPOINT + 'api/v1/pagesearch/';
  public static API_SEARCH_RESULT_LOAD_MORE = API_ENDPOINT + 'api/v1/searchmore/';
  public static INSTAGRAM_ACCESS_TOKEN = '5544202380.58b5f2c.fa60c5d58b8443e6a654f966753ad5ba';
  public static FACEBOOK = {
    appId: '289859484806086',
    xfbml: true,
    version: 'v2.9'
  };

  public static PAGE_SIZE: number = PAGE_SIZE;
  public static GMAP_STYLE = [
    {
      featureType: 'administrative',
      stylers: [
        {
          color: '#5b6571'
        },
        {
          lightness: '35'
        },
        {
          visibility: 'simplified'
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
          lightness: '15'
        },
        {
          visibility: 'off'
        },
        {
          weight: '0.01'
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
      featureType: 'administrative.land_parcel',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'administrative.neighborhood',
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
          color: '#a46c00'
        },
        {
          visibility: 'simplified'
        }
      ]
    },
    {
      featureType: 'landscape',
      stylers: [
        {
          color: '#f3f4f4'
        },
        {
          visibility: 'on'
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
          visibility: 'off'
        },
        {
          weight: 0.9
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
      featureType: 'poi',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'poi.business',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#83cead'
        },
        {
          visibility: 'on'
        }
      ]
    },
    {
      featureType: 'road',
      stylers: [
        {
          color: '#ffffff'
        },
        {
          visibility: 'on'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'labels',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'road.arterial',
      stylers: [
        {
          color: '#ffffff'
        },
        {
          visibility: 'simplified'
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
      featureType: 'road.highway',
      stylers: [
        {
          color: '#fee379'
        },
        {
          visibility: 'on'
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
      stylers: [
        {
          visibility: 'off'
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
      stylers: [
        {
          color: '#7fc8ed'
        },
        {
          visibility: 'on'
        }
      ]
    },
    {
      featureType: 'water',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    }
  ];

  public static NEIGHBOURHOODS = [
    'Singapore', 'Bugis', 'Bukit Timah', 'Changi', 'Chinatown', 'Clarke Quay',
    'Dempsey Hill', 'East Coast', 'Harbourfront', 'Holland Village', 'Joochiat',
    'Katong', 'Jurong', 'Kampong Glam', 'Little India', 'Marina Bay', 'Orchard',
    'Punggol', 'Sentosa', 'Serangoon', 'Tanjong Pagar', 'Thomson', 'Tiong Baru', 'Toa Payoh'];

  public static defaultUser: User = {
    id: 0,
    avatar: 'assets/img/avatar/demoavatar.png',
    name: '',
    slug: '',
    isAnonymous: true,
    firstName: '',
    lastName: '',
    contactNumber: '',
    country: '',
    followingNumber: 0,
    followerNumber: 0,
    email: '',
    followings: [],
    followers: [],
    followed: false,
    showNav: true,
    acceptNotification: false,
  };
}
