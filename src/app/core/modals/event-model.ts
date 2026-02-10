import { Hobby } from "../enums/hobby.enum";

export interface EventModel {
  _id?: string;
  title: string;
  description: string;
  hobby: Hobby;
  date: Date;
  lat: number;
  lng: number;
  creatorId: string;
  creatorUser: string;
  participants: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateEventDto {
  title: string;
  description: string;
  hobby: string;
  date: Date;
  lat: number;
  lng: number;
}
