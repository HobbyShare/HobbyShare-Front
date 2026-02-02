import { Hobby } from "../enums/hobby.enum";

export interface EventModel {
  _id?: string;
  title: string;
  description: string;
  hobby: Hobby;
  date: string;
  lat: number;
  lng: number;
  creatorId: string;
  creatorUser: string;
  participants: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventDto {
  title: string;
  description: string;
  hobby: string;
  date: string;
  lat: number;
  lng: number;
}
