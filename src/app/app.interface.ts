export interface User {
  firstName: string;
  lastName: string;
  contactNumber: string;
  avatar: 'assets/img/avatar/demoavatar.png';
  followingNumber: number;
  followerNumber: number;
  receiveEmail: number;
  userFollowing: User[];
  userFollower: User[];
  showNav: true;
  acceptNotification: true;
}

export interface HyloEvent {
  name: string;
  location: Location;
  detail: string;
  category: string;
  time: string;
  price: string;
  call2action: Call2Action;
  mentions: Icon[];
  images: string[];
  rating: number;
  comments: HyloComment[];
}

export interface Location {
  name: string;
  lat: number;
  lng: number;
}

export interface Icon {
  url: string;
  iconUrl: string;
}

export interface Call2Action {
  action: string;
  link: string;
}

export interface HyloComment {
  rating: number;
  comment: string;
  images: string[];
  user: User;
  comments: HyloComment[];
  likeNumber: number;
  date: string;
}
