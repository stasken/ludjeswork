import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, Timestamp } from '@angular/fire/firestore';
// import { Shift } from 'src/models/shift';
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
@Injectable({
  providedIn: 'root'
})
export class ShiftsService {

  constructor(private firestore: Firestore) { }

  addShift(shift: Shift) {
    const shiftRef = collection(this.firestore, "shifts")
    return addDoc(shiftRef, shift)
  }
}
