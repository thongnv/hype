export interface BaseUser {
  avatar: string;
  name: string;
  slug: string;
}

export interface User extends BaseUser {
  id: number;
  firstName: string;
  lastName: string;
  contactNumber: string;
  followingNumber: number;
  followerNumber: number;
  email: string;
  followings: Follower[];
  followers: Follower[];
  followed: boolean;
  showNav: boolean;
  acceptNotification: boolean;
  isAnonymous: boolean;
}

export interface Follower extends BaseUser {
  id: number;
  followed: boolean;
}

export interface HyloEvent {
  id: number;
  creator: BaseUser;
  name: string;
  location: Location;
  detail: string;
  category: string;
  startDate: number;
  endDate: number;
  price: number;
  call2action: Call2Action;
  mentions: Icon[];
  images: Image[];
  rating: number;
  userRated: boolean;
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
  id: number;
  author: BaseUser;
  rating: number;
  date: number;
  text: string;
  images: Image[];
  comments: HyloComment[];
  likeNumber: number;
  liked: boolean;
}

export interface HyloComment {
  id: number;
  pid: number;
  author: BaseUser;
  text: string;
  likeNumber: number;
  replies: HyloComment[];
  liked: boolean;
}

export interface EventType {
  id: number;
  name: string;
  iconUrl: string;
  selected: boolean;
}

export interface FileReaderEventTarget extends EventTarget {
  result: string;
}

export interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;
  getMessage(): string;
}

export interface Image {
  url: string;
  value: string;
  filename: string;
  filemime: string;
  filesize: number;
}

export interface LoaderState {
  show: boolean;
}

export interface SmallLoaderState {
  loading: boolean;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  rating: number;
  location: Location;
  website: string;
  phone: string;
  openingHours: string[];
  images: Image[];
  instagramUrl: string;
  reviews: Experience[];
  bookmarked: boolean;
  rated: boolean;
}
