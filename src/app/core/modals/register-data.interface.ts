import { Hobby } from "../enums/hobby.enum";

export interface RegisterData {
  username: string;
  name: string;
  email: string;
  password: string;
  hobbies: Hobby[];
}
