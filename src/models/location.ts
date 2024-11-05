import { Timestamp } from "@angular/fire/firestore";

export class Location {
    id?: string;
    name: string;
    town: string;
    address: string;
    totalWorkedShifts: number;
    totalEarned: number;
    averageRating: number;
  
    constructor(name: string, town: string, address: string, totalWorkedShifts: number, totalEarned: number, averageRating: number) {
      this.name = name;
      this.town = town;
      this.address = address;
      this.totalWorkedShifts = totalWorkedShifts;
      this.totalEarned = totalEarned;
      this.averageRating = averageRating;
    }
  
  }