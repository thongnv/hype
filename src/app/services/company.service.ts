import { Injectable } from '@angular/core';

@Injectable()
export class CompanyService {

  constructor() {
    // TODO
  }

  public getCompany(companyID: string) {
    return {
      name: 'ABC Restaurant',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,' +
      'sed do eiusmod tempor incididunt ut labore Lorem ipsum dolor sit amet,' +
      'sed do eiusmod tempor incididunt ut labore Lorem ipsum dolor sit amet,' +
      'sed do eiusmod tempor incididunt ut labore Lorem ipsum dolor sit amet,' +
      ' consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
      rating: 3.9,
      location: {
        lat: 1.290270,
        lng: 103.851959,
        name: '438 Serangoon Rd, Singapore 218133'
      },
      website: 'https://www.abcrestaurant.com',
      phone: '612345678',
      openingHours: '(Friday): 8AM -11PM',
      images: [
        'http://vnreview.vn/image/16/60/64/1660648.jpg',
        'http://vnreview.vn/image/16/61/86/1661861.jpg',
        'http://vnreview.vn/image/16/61/81/1661819.jpg',
        'http://vnreview.vn/image/16/61/82/1661822.jpg',
        'http://vnreview.vn/image/16/61/82/1661825.jpg',
        'http://vnreview.vn/image/13/43/44/1343446.jpg',
      ],
      reviews: [
        {
          rating: 4,
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
          images: [
            '/assets/img/event/detail/abc.jpg',
            '/assets/img/event/detail/abc.jpg',
            '/assets/img/event/detail/abc.jpg',
            '/assets/img/event/detail/abc.jpg'
          ],
          user: {
            firstName: 'Derek',
            lastName: 'Ang',
            contactNumber: '123',
            userAvatar: '/assets/img/event/detail/derek.jpg',
            followingNumber: 2,
            followerNumber: 12,
            receiveEmail: 1,
            userFollowing: [],
            userFollower: [],
            showNav: true,
            acceptNotification: true,
          },
          likeNumber: 22,
          date: 1493510400,
        },
        {
          rating: 4,
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
          images: ['img1', 'img2', 'img3'],
          user: {
            firstName: 'Derek',
            lastName: 'Ang',
            contactNumber: '123',
            userAvatar: '/assets/img/event/detail/derek.jpg',
            followingNumber: 2,
            followerNumber: 12,
            receiveEmail: 1,
            userFollowing: [],
            userFollower: [],
            showNav: true,
            acceptNotification: true,
          },
          likeNumber: 22,
          date: 1495238400,
        }
      ]
    };
  }
}
