import { Injectable } from '@angular/core';
import { Experience, HyloComment, HyloEvent } from '../app.interface';

@Injectable()
export class EventService {

  constructor() {
    // TODO
  }

  public getEvent(eventId: string): HyloEvent {
    return {
      creator: {
        firstName: 'Penny',
        lastName: 'Lim',
        contactNumber: '23243',
        avatar: 'assets/img/avatar/demoavatar.png',
        followingNumber: 12,
        followerNumber: 1,
        receiveEmail: 2,
        userFollowing: [],
        userFollower: [],
        showNav: true,
        acceptNotification: true,
      },
      name: 'One Direction Concert in Singapore',
      location: {
        lat: 1.290270,
        lng: 103.851959,
        name: 'Singapore Indoor Stadium'
      },
      detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
      category: '',
      date: '1st April 2017',
      price: '$$$',
      call2action: {
        action: 'Buy Tickets',
        link: '#'
      },
      mentions: [
        {url: 'url', iconUrl: '/assets/img/eventdetailpage/mention.jpg'},
        {url: 'url', iconUrl: '/assets/img/eventdetailpage/mention.jpg'},
        {url: 'url', iconUrl: '/assets/img/eventdetailpage/mention.jpg'},
        {url: 'url', iconUrl: '/assets/img/eventdetailpage/mention.jpg'},
      ],
      images: [
        'http://vnreview.vn/image/16/60/64/1660648.jpg',
        'http://vnreview.vn/image/16/61/86/1661861.jpg',
        'http://vnreview.vn/image/16/61/81/1661819.jpg',
        'http://vnreview.vn/image/16/61/82/1661822.jpg',
        'http://vnreview.vn/image/16/61/82/1661825.jpg',
        'http://vnreview.vn/image/13/43/44/1343446.jpg',
      ],
      rating: 3.9,
      experiences: [
        {
          rating: 4,
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
          images: [
            '/assets/img/eventdetailpage/abc.jpg',
            '/assets/img/eventdetailpage/abc.jpg',
            '/assets/img/eventdetailpage/abc.jpg',
            '/assets/img/eventdetailpage/abc.jpg'
          ],
          user: {
            firstName: 'Derek',
            lastName: 'Ang',
            contactNumber: '123',
            avatar: '/assets/img/eventdetailpage/derek.jpg',
            followingNumber: 2,
            followerNumber: 12,
            receiveEmail: 1,
            userFollowing: [],
            userFollower: [],
            showNav: true,
            acceptNotification: true,
          },
          comments: [
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
              replies: []
            },
          ],
          likeNumber: 22,
          date: '4 April 2017',
        },
        {
          rating: 4,
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
          images: ['img1', 'img2', 'img3'],
          user: {
            firstName: 'Derek',
            lastName: 'Ang',
            contactNumber: '123',
            avatar: '/assets/img/eventdetailpage/derek.jpg',
            followingNumber: 2,
            followerNumber: 12,
            receiveEmail: 1,
            userFollowing: [],
            userFollower: [],
            showNav: true,
            acceptNotification: true,
          },
          comments: [
            {
              user: {
                firstName: 'HK',
                lastName: 'Lin',
                contactNumber: '23243',
                avatar: '/assets/img/eventdetailpage/tank.jpg',
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
              replies: []
            },
            {
              user: {
                firstName: 'HK',
                lastName: 'Lin',
                contactNumber: '23243',
                avatar: '/assets/img/eventdetailpage/tank.jpg',
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
              replies: []
            },
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
              replies: []
            },
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
              replies: []
            },
          ],
          likeNumber: 22,
          date: '4 April 2017',
        }
      ]
    };
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
          replies: []
        }
      ];
  }

}
