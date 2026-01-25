export interface Event {
  _id?: string;
  title: string;
  description: string;
  category: string;
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
  category: string;
  date: string;
  lat: number;
  lng: number;
}
