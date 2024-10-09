import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, getDocs, orderBy, query, Timestamp, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Shift } from 'src/models/shift';

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
      console.log(doc);

      let shift = doc.data() as Shift; // Cast to Workday type
      shift.id = doc.id; // Add the document ID to the object
      shiftArray.push(shift); // Push to array
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
      shift.id = doc.id; // Add document ID to the object
      futureShifts.push(shift); // Add to the array
    });

    return futureShifts;
  }

  addShift(shift: Shift) {
    const shiftRef = collection(this.firestore, "shifts")
    return addDoc(shiftRef, shift)
  }
}
