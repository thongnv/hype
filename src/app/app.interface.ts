export interface User {
  firstName: string;
  lastName: string;
  contactNumber: string;
  avatar: string;
  followingNumber: number;
  followerNumber: number;
  receiveEmail: number;
  userFollowing: User[];
  userFollower: User[];
  showNav: true;
  acceptNotification: true;
}

export interface HyloEvent {
  creator: User;
  name: string;
  location: Location;
  detail: string;
  category: string;
  date: string;
  price: string;
  call2action: Call2Action;
  mentions: Icon[];
  images: string[];
  rating: number;
  experiences: Experience[];
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

export interface Experience {
  user: User;
  rating: number;
  date: string;
  text: string;
  images: string[];
  comments: HyloComment[];
  likeNumber: number;
}

export interface HyloComment {
  user: User;
  text: string;
  likeNumber: number;
  replies: HyloComment[];
}
