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

      let shift = doc.data() as Shift; 
      console.log("allshift");
      console.log(shift);
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

  // async updateMultipleRecordsInTransaction(updates: {id: string, data: any}[]) {
  //   const firestore = this.firestore.firestore;

  //   try {
  //     await firestore.runTransaction(async (transaction) => {
  //       updates.forEach((update) => {
  //         const docRef = firestore.collection('your-collection').doc(update.id);
  //         transaction.update(docRef, update.data); // Transactionally update the document
  //       });
  //     });
  //     console.log('Transaction successfully committed!');
  //   } catch (error) {
  //     console.error('Transaction failed: ', error);
  //   }
  // }
}
