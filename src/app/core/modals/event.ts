export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  lat: number;
  lng: number;
  creatorId: string;
  creatorUser: string;
  participants: string[]
}
