import { HyloLocation, User } from './app.interface';
let _ENV = process.env.NODE_ENV || process.env.ENV;
let PAGE_SIZE = 10;
let API_ENDPOINT = '';
let NODE_JS = '';

if (_ENV === 'development') {
  API_ENDPOINT = 'http://hypeweb.iypuat.com:5656/';
  NODE_JS = 'http://192.168.35.56:9696';
}

if (_ENV === 'production') {
  API_ENDPOINT = 'https://admin.hylo.sg/';
  NODE_JS = 'https://notifications.hylo.sg/api/v1/notification';
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

  public static NEIGHBOURHOODS: HyloLocation[] = [
    {name: 'Singapore', lat: 1.290270, lng: 103.851959},
    {name: 'Bugis', lat: 1.3009033, lng: 103.85624889999997},
    {name: 'Bukit Timah', lat: 1.3294113, lng: 103.80207769999993},
    {name: 'Changi', lat: 1.3450101, lng: 103.98320890000002},
    {name: 'Chinatown', lat: 1.2847875, lng: 103.84393120000004},
    {name: 'Clarke Quay', lat: 1.291001, lng: 103.84449889999996},
    {name: 'Dempsey Hill', lat: 1.3033106, lng: 103.80946059999997},
    {name: 'East Coast', lat: 1.3007842, lng: 103.91218660000004},
    {name: 'Harbourfront', lat: 1.264325, lng: 103.82030600000007},
    {name: 'Holland Village', lat: 1.3119456, lng: 103.79623330000004},
    {name: 'Joochiat', lat: 1.3099091, lng: 103.90202690000001},
    {name: 'Katong', lat: 1.3039671, lng: 103.90128649999997},
    {name: 'Jurong', lat: 1.3328572, lng: 103.74355220000007},
    {name: 'Kampong Glam', lat: 1.3029735, lng: 103.85987499999999},
    {name: 'Little India', lat: 1.3065597, lng: 103.85181899999998},
    {name: 'Marina Bay', lat: 1.2914319, lng: 103.86390970000002},
    {name: 'Orchard', lat: 1.3048425, lng: 103.8318243},
    {name: 'Punggol', lat: 1.3984457, lng: 103.9072046},
    {name: 'Sentosa', lat: 1.2494041, lng: 103.83032090000006},
    {name: 'Serangoon', lat: 1.3553567, lng: 103.86787079999999},
    {name: 'Tanjong Pagar', lat: 1.2764031, lng: 103.84685850000005},
    {name: 'Thomson', lat: 1.3274912, lng: 103.8413329},
    {name: 'Tiong Baru', lat: 1.2870812, lng: 103.82855440000003},
    {name: 'Toa Payoh', lat: 1.3343035, lng: 103.85632650000002}
  ];

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

  public static SingaporeLatLng = {lat: 1.290270, lng: 103.851959};
}
