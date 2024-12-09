import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDocs, orderBy, query } from '@angular/fire/firestore';
import { Document } from 'src/models/document';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  constructor(private firestore: Firestore) { }
  
  async getAllDocuments() {  
    let documentArray: Document[] = [];

    const documentsRef = collection(this.firestore, 'documents');
    const q = query(documentsRef,
      orderBy('startdate', 'asc'));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      let document = doc.data() as Document;
      documentArray.push(document);
    });

    return documentArray; // Return the array of workdays
  }

  // addDocument(this.selectedFile!.name, downloadURL);
  addDocument(name: string, downloadURL: string) {
    const docRef = collection(this.firestore, "documents")
    let newDoc = new Document(name, downloadURL)
    return addDoc(docRef, newDoc)
  }

}
