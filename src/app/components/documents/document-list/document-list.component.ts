import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { EmailComposer, EmailComposerOptions } from '@awesome-cordova-plugins/email-composer/ngx';
import { ModalController } from '@ionic/angular';
import { AddDocumentModalComponent } from 'src/app/modals/add-document-modal/add-document-modal.component';
import { DocumentsService } from 'src/app/services/documents.service';
import { Document } from 'src/models/document';

import { File as IonicFile } from '@awesome-cordova-plugins/file/ngx'

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
})
export class DocumentListComponent implements OnInit {
  // Documents
  documents: Document[] = [];

  // isImage = false;
  // imageData = "";
  // fileData = "";
  // fileData64 = "";
  // fileName = "";

  constructor(private file: IonicFile,private documentService: DocumentsService, private emailComposer: EmailComposer, private modalController: ModalController) { }

  ngOnInit() {
    this.getAllDocuments();
  }

  getAllDocuments() {
    this.documentService.getAllDocuments().then(docs => {
      this.documents = [...docs];
      console.log(this.documents);
    })
  }

  async addDocument() {
    const modal = await this.modalController.create({
      component: AddDocumentModalComponent,
      componentProps: {},
    });

    modal.onDidDismiss().then(async data => {
      if (!data.data) return;
      let isImage = data.data.isImage;
      let fileName = data.data.fileName;
      let fileData64 = isImage ? `base64:image.jpg//${data.data.fileData}` : data.data.fileData;
      let fileData = data.data.fileData;

      let date = Timestamp.fromDate(new Date())
      let newDoc = new Document(fileName, fileData, fileData64, false, isImage, date);
      this.documents.push(newDoc);
    });

    return await modal.present();
  }

  async sendEmail(doc: Document) {
    this.openEmail(doc).then(async res => {
      console.log("email lukt");
      doc.sent = true;
      await this.documentService.addDocument({ name: doc.name, data: doc.data, data64: doc.data64, sent: true, isImage: doc.isImage, uploaddate: doc.uploaddate }).then(res => {
      }, error => {
        console.log("db doc toevoegen lukt niet");
      })
    }, error => {
      console.log("email lukt niet");
    })
  }

  async openEmail(doc: Document) {
    if (doc.isImage) {
      const email: EmailComposerOptions = {
        // to: 'vander-mynsbrugge-ludwina@yukiworks.be',
        to: 'arno_stas@hotmail.com',
        attachments: [doc.data64],
        subject: 'Factuur',
        body: ''
      }
  
      await this.emailComposer.open(email);
    } else {
      const filePath = await this.createFileFromBase64(doc.data64, 'invoice.pdf');

      const email: EmailComposerOptions = {
        // to: 'vander-mynsbrugge-ludwina@yukiworks.be',
        to: 'arno_stas@hotmail.com',
        attachments: [filePath],
        subject: 'Factuur',
        body: ''
      }
  
      await this.emailComposer.open(email);
    }

  }


  async createFileFromBase64(base64Data: string, fileName: string) {
    try {
      // Specify the directory where the file will be saved
      const directory = this.file.dataDirectory; // Safe app-specific directory
      const filePath = directory + fileName;
  
      // Decode base64 and write to file
      await this.file.writeFile(directory, fileName, this.base64ToBlob(base64Data, 'application/pdf'), { replace: true });
      console.log('File created at: ', filePath);
  
      return filePath;
    } catch (error) {
      console.error('Error creating file: ', error);
      throw error;
    }
  }
  
  // Helper function to convert base64 to Blob
  base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
  
    return new Blob([byteArray], { type: contentType });
  }

}
