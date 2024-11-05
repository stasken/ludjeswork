import { Timestamp } from "@angular/fire/firestore";

export class Shift {
    id?: string;
    locationId: string;
    comment: string;
    platform: string;
    accepted: boolean;
    break: number;
    earnings: number;
    rating: number;
    enddate: Timestamp;
    startdate: Timestamp;
  
    constructor(locationId: string, platform: string, comment: string, accepted: boolean, breakMinutes: number, earnings: number, rating: number,
      enddate: Timestamp, startdate: Timestamp
    ) {
      this.locationId = locationId;
      this.platform = platform;
      this.comment = comment;
      this.accepted = accepted;
      this.break = breakMinutes;
      this.earnings = earnings;
      this.rating = rating;
      this.enddate = enddate;
      this.startdate = startdate;
    }
  
  }