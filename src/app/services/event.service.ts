import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { Experience, HyloComment, HyloEvent, Icon } from '../app.interface';

@Injectable()
export class EventService {

  public data: any;

  constructor(private http: Http) {
    this.data = this.mockCallEventDetailAPI();
  }

  public getEventDetail() {
    return this.extractEventDetail(this.data);
  }

  public getComments(start: number, experienceIndex: number): HyloComment[] {
    return [
      {
        user: {
          firstName: 'HK',
          lastName: 'Lin',
          contactNumber: '23243',
          avatar: 'assets/img/avatar/demoavatar.png',
          followingNumber: 2,
          followerNumber: 1,
          receiveEmail: 0,
          userFollowing: [],
          userFollower: [],
          showNav: true,
          acceptNotification: true,
        },
        text: 'I was there too. Awesome concert ever...',
        likeNumber: 0,
        liked: false,
        replies: []
      }
    ];
  }

  private mockCallEventDetailAPI() {
    return MOCK_EVENT;
  }

  private extractEventDetail(data): HyloEvent {
    let event: HyloEvent = {
      creator: {
        firstName: data.user_post.name,
        lastName: '',
        contactNumber: '',
        avatar: data.user_post.user_picture,
        followingNumber: 0,
        followerNumber: 0,
        receiveEmail: 0,
        userFollowing: [],
        userFollower: [],
        showNav: true,
        acceptNotification: true
      },
      images: this.extractImages(data.field_image),
      detail: data.body,
      date: data.created,
      category: data.field_category,
      location: {
        name: data.field_location_place.field_location_address,
        lat: data.field_location_place.field_latitude,
        lng: data.field_location_place.field_longitude
      },
      name: data.title,
      price: data.field_event_option.field_price,
      call2action: {
        link: data.field_event_option.field_call_to_action_link,
        action: MOCK_ACTIONS[data.field_event_option.field_call_to_action_group - 1]
      },
      mentions: this.extractMentions(data.field_event_option.field_mentioned_by),

      rating: data.average_rating,
      rated: false,
      experiences: this.extractExperiences(data.comments.data)
    };
    return event;
  }

  private extractImages(data): string[] {
    let images = [];
    for (let item of data) {
      images.push(item.url);
    }
    return images;
  }

  private extractMentions(data): Icon[] {
    let mentions = [];
    for (let item of data) {
      mentions.push(
        {
          url: item.item,
          iconUrl: 'https://www.google.com/s2/favicons?domain=' + item.item,
        }
      );
    }
    return mentions;
  }

  private extractExperiences(data): Experience[] {
    let experiences = [];
    for (let item of data) {
      experiences.push(
        {
          user: {
            firstName: item.author_name,
            lastName: '',
            contactNumber: 0,
            avatar: item.author_avatar,
            followingNumber: 0,
            followerNumber: 0,
            receiveEmail: '',
            userFollowing: [],
            userFollower: [],
            showNav: true,
            acceptNotification: true,
          },
          rating: item.rating,
          date: item.created,
          text: item.comment_body,
          images: this.extractImages(item.comment_images),
          comments: this.extractComments(item.children),
          likeNumber: item.like_comment,
          liked: item.user_like
        }
      );
    }
    return experiences;
  }

  private extractComments(data): HyloComment[] {
    let comments = [];
    for (let item of data) {
      comments.push(
        {
          user: {
            firstName: item.author_name,
            lastName: '',
            contactNumber: '',
            avatar: item.author_avatar,
            followingNumber: 0,
            followerNumber: 0,
            receiveEmail: 0,
            userFollowing: [],
            userFollower: [],
            showNav: true,
            acceptNotification: true,
          },
          text: item.comment_body,
          likeNumber: item.like_comment,
          liked: item.user_like,
          replies: []
        }
      );
    }
    return comments;
  }
}

let MOCK_EVENT = {
  nid: "30",
  title: " Sau T\u1ea5t C\u1ea3 ",
  body: "\u003Cp\u003ECh\u1eb3ng m\u1ed9t ai c\u00f3 th\u1ec3 c\u1ea3n \u0111\u01b0\u1ee3c tr\u00e1i tim khi \u0111\u00e3 l\u1ee1 y\u00eau r\u1ed3i \u0110\u1eebng ai can ng\u0103n t\u00f4i khuy\u00ean t\u00f4i bu\u00f4ng xu\u00f4i v\u00ec y\u00eau kh\u00f4ng c\u00f3 l\u1ed7i Ai c\u0169ng \u01b0\u1edbc mu\u1ed1n khao kh\u00e1t \u0111\u01b0\u1ee3c y\u00eau \u0110\u01b0\u1ee3c ch\u1edd mong t\u1edbi gi\u1edd ai nh\u1eafc \u0111\u01b0a \u0111\u00f3n bu\u1ed5i chi\u1ec1u M\u1ed7i s\u00e1ng th\u1ee9c d\u1eady \u0111\u01b0\u1ee3c ng\u1eafm m\u1ed9t ng\u01b0\u1eddi n\u1eb1m c\u1ea1nh ng\u1ee7 say.\u003C\/p\u003E\r\n",
  created: "1496372521",
  user_post: {
    ui: "1",
    name: "admin",
    user_picture: "/assets/img/event/detail/tank.jpg"
  },
  field_image: [
    {
      "url": "http:\/\/hypeweb.iypuat.com:5656\/sites\/default\/files\/2017-06\/chiem-nguong-nhung-buc-anh-chan-dung-sieu-an-tuong-duoc-ve-bang-but-chi.png"
    },
    {
      "url": "http:\/\/hypeweb.iypuat.com:5656\/sites\/default\/files\/2017-06\/qianbihua7.jpg"
    },
    {
      "url": "http:\/\/hypeweb.iypuat.com:5656\/sites\/default\/files\/2017-06\/chiem-nguong-nhung-buc-anh-chan-dung-sieu-an-tuong-duoc-ve-bang-but-chi%20%281%29.png"
    }
  ],
  "field_category": [],
  "field_location_place": {
    "field_latitude": 1.280270,
    "field_longitude": 103.851959,
    "field_location_address": "Singapore Indoor Stadium"
  },
  "field_event_option": {
    "field_call_to_action_group": "1",
    "field_call_to_action_link": "http:\/\/mp3.zing.vn\/bai-hat\/Phia-Sau-Mot-Co-Gai-Soobin-Hoang-Son\/ZW78U908.html",
    "field_date_time": "2017-05-09",
    "field_price": "40",
    "field_mentioned_by": [
      {
        "item": "http:\/\/ione.vnexpress.net\/"
      },
      {
        "item": "http:\/\/ione.vnexpress.net\/"
      },
      {
        "item": "http:\/\/ione.vnexpress.net\/"
      },
      {
        "item": "http:\/\/ione.vnexpress.net\/"
      }
    ]
  },
  "comments": {
    "total": 5,
    "data": [
      {
        "cid": "34",
        "author_name": "admin",
        "author_avatar": "/assets/img/event/detail/tank.jpg",
        "pid": 0,
        "comment_images": [
          {url: 'http://vnreview.vn/image/16/60/64/1660648.jpg'},
          {url: 'http://vnreview.vn/image/16/64/69/1664694.jpg'},
          {url: 'http://vnreview.vn/image/16/64/72/1664721.jpg'},
          {url: 'http://vnreview.vn/image/16/64/72/1664724.jpg'},
          {url: 'http://vnreview.vn/image/16/64/73/1664733.jpg'},
          {url: 'http://vnreview.vn/image/16/64/73/1664730.jpg'},
          {url: 'http://vnreview.vn/image/16/64/68/1664686.jpg'},
          {url: 'http://vnreview.vn/image/16/64/70/1664700.jpg'},

        ],
        "rating": 2,
        "like_comment": 0,
        "user_like": false,
        "comment_body": "\u003Cp\u003ETR\u01b0\u1edbc t\u1ea5t c\u1ea3\u003C\/p\u003E",
        "created": "1496375961",
        "children": []
      },
      {
        "cid": "35",
        "author_name": "admin",
        "author_avatar": "",
        "pid": 0,
        "comment_images": [
          {
            "url": 'http://vnreview.vn/image/16/60/64/1660648.jpg'
          },
          {
            "url": 'http://vnreview.vn/image/16/60/64/1660648.jpg'
          },
          {
            "url": 'http://vnreview.vn/image/16/60/64/1660648.jpg'
          }
        ],
        "rating": 3,
        "like_comment": 0,
        "user_like": false,
        "comment_body": "\u003Cp\u003EV\u1eeba t\u1ea5t c\u1ea3\u003C\/p\u003E",
        "created": "1496376015",
        "children": [
          {
            "cid": "37",
            "author_name": "admin",
            "author_avatar": "",
            "pid": "35",
            "comment_images": [
              {
                "url": "https:\/\/s3.amazonaws.com\/hylowebsite\/avatar\/2017-06\/badu-live.png"
              },
              {
                "url": "https:\/\/s3.amazonaws.com\/hylowebsite\/avatar\/2017-06\/bjork-live.jpg"
              },
              {
                "url": 'http://vnreview.vn/image/16/60/64/1660648.jpg'
              },
              {
                "url": 'http://vnreview.vn/image/16/60/64/1660648.jpg'
              }
            ],
            "rating": 1,
            "like_comment": 0,
            "user_like": false,
            "comment_body": "\u003Cp\u003ETest abc\u003C\/p\u003E\r\n",
            "created": "1496376564",
            "children": []
          }
        ]
      },
      {
        "cid": "36",
        "author_name": "admin",
        "author_avatar": "",
        "pid": 0,
        "comment_images": [
          {
            "url": 'http://vnreview.vn/image/16/60/64/1660648.jpg'
          },
          {
            "url": 'http://vnreview.vn/image/16/60/64/1660648.jpg'
          },
          {
            "url": 'http://vnreview.vn/image/16/60/64/1660648.jpg'
          }
        ],
        "rating": 3,
        "like_comment": "1",
        "user_like": true,
        "comment_body": "\u003Cp\u003E3 \u003C\/p\u003E",
        "created": "1496376134",
        "children": []
      }
    ]
  },
  "average_rating": 2.7
};

let MOCK_ACTIONS = [
  'Buy Tickets',
  'Special Order'
];
