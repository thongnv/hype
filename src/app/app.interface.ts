export interface User extends BaseUser {
  firstName: string;
  lastName: string;
  contactNumber: string;
  followingNumber: number;
  followerNumber: number;
  receiveEmail: number;
  userFollowing: User[];
  userFollower: User[];
  showNav: true;
  acceptNotification: true;
}

export interface BaseUser {
  avatar: string;
  name: string;
}

export interface HyloEvent {
  creator: BaseUser;
  name: string;
  location: Location;
  detail: string;
  category: string;
  date: number;
  price: string;
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
  user: BaseUser;
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
