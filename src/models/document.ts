import { Timestamp } from "@angular/fire/firestore";

export class Document {
    id?: string;
    name: string;
    data: string;
    data64: string;
    sent: boolean;
    isImage: boolean;
    uploaddate: Timestamp
  
    constructor(name: string, data: string, data64: string, sent: boolean, isImage: boolean, date: Timestamp) {
      this.name = name;
      this.data = data;
      this.data64 = data64;
      this.sent = sent;
      this.isImage = isImage;
      this.uploaddate = date;
    }
  }