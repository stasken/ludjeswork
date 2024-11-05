import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, orderBy, query, updateDoc } from '@angular/fire/firestore';
import { Location } from 'src/models/location';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  constructor(private firestore: Firestore) { }

  async getAllLocations() {
    let locationArray: Location[] = [];

    const locationsRef = collection(this.firestore, 'locations');
    const q = query(locationsRef,
      orderBy('town', 'asc'));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      let location = doc.data() as Location;
      location.id = doc.id;
      locationArray.push(location);
    });

    return locationArray;
  }

  addLocation(location: Location) {
    const locationRef = collection(this.firestore, "locations")
    return addDoc(locationRef, location)
  }

  updateLocation(location: Location) {
    const locationRef = doc(this.firestore, `locations/${location.id}`);
    return updateDoc(locationRef, {
      name: location.name,
      town: location.town,
      address: location.address,
      totalWorkedShifts: location.totalWorkedShifts,
      totalEarned: location.totalEarned,
      averageRating: location.averageRating
    });
  }

  updateLocationRating(location: Location) {
    const locationRef = doc(this.firestore, `locations/${location.id}`);
    return updateDoc(locationRef, {
      averageRating: location.averageRating
    });
  }

  updateLocationEarnings(location: Location) {
    const locationRef = doc(this.firestore, `locations/${location.id}`);
    return updateDoc(locationRef, {
      totalEarned: location.totalEarned,
    });
  }
  
  deleteLocation(location: Location) {
    const locationRef = doc(this.firestore, `locations/${location.id}`);
    return deleteDoc(locationRef);
  }
}
