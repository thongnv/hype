import { Injectable } from '@angular/core';
import { HyloEvent } from '../app.interface';

@Injectable()
export class EventService {

  constructor() {
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
        link: ''
      },
      mentions: [
        {url: 'url', iconUrl: 'icon'},
        {url: 'url', iconUrl: 'icon'},
        {url: 'url', iconUrl: 'icon'},
        {url: 'url', iconUrl: 'icon'},
      ],
      images: [
        'http://www.angulartypescript.com/wp-content/uploads/2016/03/car1.jpg',
        'http://www.angulartypescript.com/wp-content/uploads/2016/03/car2.jpg',
        'http://www.angulartypescript.com/wp-content/uploads/2016/03/car3.jpg',
        'http://www.angulartypescript.com/wp-content/uploads/2016/03/car4.jpg',
        'http://www.angulartypescript.com/wp-content/uploads/2016/03/car5.jpg',
        'http://www.angulartypescript.com/wp-content/uploads/2016/03/car6.jpg',
        'http://www.angulartypescript.com/wp-content/uploads/2016/03/car6.jpg',
        'http://www.angulartypescript.com/wp-content/uploads/2016/03/car6.jpg',
      ],
      rating: 3.9,
      experiences: [
        {
          rating: 4,
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
          images: ['img1', 'img2', 'img3'],
          user: {
            firstName: 'Derek',
            lastName: 'Ang',
            contactNumber: '123',
            avatar: 'assets/img/avatar/demoavatar.png',
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
            avatar: 'assets/img/avatar/demoavatar.png',
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

}
