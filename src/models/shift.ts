import { Timestamp } from 'firebase/firestore';

export class Shift {
  id?: string;
  location: string;
  platform: string;

  constructor(location:string,platform:string) {
    this.location=location;
    this.platform=platform;
  }

}