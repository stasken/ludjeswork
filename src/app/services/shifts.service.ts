import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, getDocs, orderBy, query, Timestamp, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Shift } from 'src/models/shift';
import { ShiftItem } from '../shifts/shift-list/shift-list.component';

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {

  constructor(private firestore: Firestore) { }

  async getAllShifts() {
    let shiftArray: Shift[] = [];

    // Reference to the collection
    const shiftsRef = collection(this.firestore, 'shifts');

    // Get all documents in the collection
    const querySnapshot = await getDocs(shiftsRef);

    // Iterate over the snapshot and push each document's data to the array
    querySnapshot.forEach((doc) => {
      let shift = doc.data() as Shift;
      shift.id = doc.id; // Add the document ID to the object
      shiftArray.push(shift);
    });

    return shiftArray; // Return the array of workdays
  }

  async getAllFutureShifts() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let futureShifts: Shift[] = [];

    const shiftRef = collection(this.firestore, "shifts")
    const q = query(shiftRef, where('startdate', '>=', today),
      orderBy('startdate', 'asc'));
    const querySnapshot = await getDocs(q);

    // Process the query results and add them to the array
    querySnapshot.forEach((doc) => {
      let shift = doc.data() as Shift; // Cast document data to shift
      console.log("futreshift");
      console.log(shift);

      shift.id = doc.id; // Add document ID to the object
      futureShifts.push(shift);
    });

    return futureShifts;
  }

  addShift(shift: Shift) {
    const shiftRef = collection(this.firestore, "shifts")
    return addDoc(shiftRef, shift)
  }

  updateShift(shift: ShiftItem) {
    const shiftRef = doc(this.firestore, `shifts/${shift.id}`);
    return updateDoc(shiftRef, {
      accepted: shift.accepted,
      break: shift.break,
      earnings: shift.earnings
    });
  }

}
