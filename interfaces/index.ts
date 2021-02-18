// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';

export type TUser = {
  email: string;
  password: string;
};

export interface THouse {
  picture: string;
  title: string;
  reviewCount?: number;
  id: string;
  type: string;
  town: string;
  rating?: number;
  price: number;
  guests?: number;
  bedrooms?: number;
  beds?: number;
  baths?: number;
  amenities?: Record<string, boolean>;
  entirePlace?: boolean;
  reviews?: TReview[];
  superhost?: boolean;
  hostName: string;
  description?: string;
}

export interface TReview {
  user: string;
  avatar: string;
  createdAt: string;
  comment: string;
}

export interface TBooking {
  house: THouse;
  startDate: string;
  endDate: string;
  createdAt: string;
}
