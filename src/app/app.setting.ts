import { User } from './app.interface';
let _ENV = process.env.NODE_ENV || process.env.ENV || 'product';
let PAGE_SIZE = 10;
let API_ENDPOINT = '';
let NODE_JS = '';

if (_ENV === 'development') {
  API_ENDPOINT = 'http://hypeweb.iypuat.com:5656/';
  NODE_JS = 'http://52.220.246.146:8000';
} else {
  API_ENDPOINT = 'http://hypeweb.iypuat.com:5656/';
  NODE_JS = 'http://52.220.246.146:8000';
}

export class AppSetting {
  public static API_ENDPOINT = API_ENDPOINT;
  public static NODE_SERVER = NODE_JS;
  public static API_LOGIN = API_ENDPOINT + 'hylo/fblogin?_format=json';
  public static API_CATEGORIES_EVENT = API_ENDPOINT + 'api/v1/category/event/?_format=json';
  public static API_ENDPOINT_LIKE = API_ENDPOINT + 'api/user/flag/bookmark?_format=json';
  public static API_ENDPOINT_CAT_MODE = API_ENDPOINT + 'api/v1/category/mode?_format=json';
  public static API_ENDPOINT_MODE = API_ENDPOINT + 'api/v1/place/search';
  public static API_ENDPOINT_TOP = API_ENDPOINT + 'api/v1/top?_format=json';
  public static API_TRENDING = API_ENDPOINT + 'api/v1/home/search';
  public static API_ARTICLE = API_ENDPOINT + 'api/v1/article';
  public static API_FAVORITE_PLACE = API_ENDPOINT + 'api/v1/favorite/place';
  public static INSTAGRAM_ACCESS_TOKEN = '5544202380.58b5f2c.fa60c5d58b8443e6a654f966753ad5ba';
  public static FACEBOOK = {
    appId: '289859484806086',
    xfbml: true,
    version: 'v2.9'
  };
  public static PAGE_SIZE: number = PAGE_SIZE;
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

  public static NEIGHBOURHOODS = [
    'Singapore', 'Alexandra', 'Aljunied', 'Amoy Street', 'Ang Mo Kio', 'Balestier', 'Bartley',
    'Bayfront', 'Beach Road', 'Beauty World', 'Bedok', 'Bedok Reservoir', 'Bencoolen', 'Bishan',
    'Boat Quay', 'Boon Keng', 'Boon Lay', 'Botanic Gardens', 'Braddell', 'Bras Basah', 'Buangkok',
    'Bugis', 'Bukit Batok', 'Bukit Gombak', 'Bukit Merah', 'Bukit Panjang', 'Bukit Timah',
    'Buona Vista', 'Changi', 'Changi Airport', 'China Square Central', 'Chinatown',
    'Chinese Garden', 'Chip Bee Gardens', 'Choa Chu Kang', 'Circular Road', 'City Hall',
    'Clarke Quay', 'Clementi', 'Club Street', 'Commonwealth',
    'Coronation', 'Dakota', 'Dempsey', 'Dhoby Ghaut', 'Dover', 'Downtown', 'Duxton',
    'East Coast Parkway', 'Esplanade', 'Eunos', 'Everton Park', 'Expo', 'Farrer Park',
    'Farrer Road', 'Fort Canning', 'Gardens by the Bay', 'Geylang', 'Geylang Bahru',
    'Great World', 'Haji Lane', 'Harbourfront', 'Hillview', 'Holland Village',
    'Hougang', 'Jalan Besar', 'Jalan Kayu', 'Jalan Riang', 'Joo Chiat', 'Jurong East',
    'Jurong West', 'Kaki Bukit', 'Kallang', 'Katong', 'Kembangan', 'Kent Ridge',
    'Khatib', 'King Albert Park', 'Kovan', 'Labrador', 'Lakeside', 'Lavender',
    'Little India', 'Lorong Kilat', 'Macpherson', 'Marina Bay', 'Marina Square',
    'Marine Parade', 'Marymount', 'Maxwell', 'Millenia Walk', 'Mountbatten',
    'Newton', 'North Bridge Road', 'Novena', 'Old Airport Road', 'One North', 'Orchard',
    'Orchard Road', 'Outram Park', 'Pasir Panjang', 'Pasir Ris', 'Paya Lebar', 'Portsdown',
    'Potong Pasir', 'Promenade', 'Punggol', 'Punggol Waterway', 'Queenstown', 'Raffles Place',
    'Rangoon Road', 'Redhill', 'River Valley', 'Robertson Quay', 'Rochor', 'Seletar', 'Sembawang',
    'Sengkang', 'Sentosa', 'Serangoon', 'Serangoon Gardens', 'Shenton Way', 'Siglap', 'Simei',
    'Simpang Bedok', 'Sixth Avenue', 'Somerset', 'Stadium', 'Stevens', 'Tai Seng', 'Tampines',
    'Tanah Merah', 'Tanglin', 'Tanjong Katong', 'Tanjong Pagar', 'Telok Ayer', 'Telok Blangah',
    'Thomson', 'Tiong Bahru', 'Toa Payoh', 'Tuas', 'Upper Bukit Timah', 'Upper East Coast Road',
    'West Coast', 'Woodlands', 'Yio Chu Kang', 'Yishun'];

  public static defaultUser: User = {
    id: 0,
    avatar: 'assets/img/avatar/demoavatar.png',
    name: '',
    slug: '',
    isAnonymous: true,
    firstName: '',
    lastName: '',
    contactNumber: '',
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
