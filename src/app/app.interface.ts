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
  country: string;
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
  slug: string;
  creator: BaseUser;
  name: string;
  location: Location;
  detail: string;
  category: { 'name': string, 'tid': string };
  startDate: number;
  endDate: number;
  prices: string[];
  organizer: string;
  call2action: Call2Action;
  mentions: Icon[];
  images: Image[];
  rating: number;
  userRated: boolean;
  experiences: Experience[];
  tags: string[];
  metaTags: MetaTags;
}

export interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

export interface MetaTags {
  title: string;
  description: string;
  keywords: string;
  canonical_url: string;
}

export interface Icon {
  url: string;
  iconUrl: string;
}

export interface Call2Action {
  id: number;
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

export interface FileReaderEventTarget extends EventTarget {
  result: string;
}

export interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;
  getMessage(): string;
}

export interface Image {
  fid: number;
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
  CTC: string;
  Company_Slug: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  body: string;
  created: number;
  field_category: any[];
  field_images: string[];
  field_places: any[];
  author: BaseUser;
}

export interface Category {
  id: number;
  name: string;
  alias: string;
  children: Category[];
}

export interface ArticlesCategory {
  image: string;
  description: string;
  articles: Article[];
}
