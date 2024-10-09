import { Timestamp } from "@angular/fire/firestore";

export class Shift {
    id?: string;
    location: string;
    platform: string;
    accepted: boolean;
    break: number;
    earnings: number;
    enddate: Timestamp;
    startdate: Timestamp;
  
    constructor(location: string, platform: string, accepted: boolean, breakMinutes: number, earnings: number,
      enddate: Timestamp, startdate: Timestamp
    ) {
      this.location = location;
      this.platform = platform;
      this.accepted = accepted;
      this.break = breakMinutes;
      this.earnings = earnings;
      this.enddate = enddate;
      this.startdate = startdate;
    }
  
  }