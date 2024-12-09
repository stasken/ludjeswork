import { Component, OnInit } from '@angular/core';

import { DocumentsService } from 'src/app/services/documents.service';

// import { EmailComposer } from 'capacitor-email-composer'
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';

// import { File } from '@awesome-cordova-plugins/file/ngx';

import { Filesystem, Directory } from '@capacitor/filesystem';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
})
export class DocumentListComponent implements OnInit {
  selectedFile: File | null = null;
  absoluteFilePath: string | null = null;

  constructor(private documentService: DocumentsService,private emailComposer: EmailComposer) { }

  ngOnInit() { }

  // fileData: string = ''; // Base64-string voor tijdelijk lokaal gebruik
  // fileName: string = ''; // Naam van het bestand
  
  // uploadFile(event: any) {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.fileData = reader.result as string; // Base64-string
  //       this.fileName = file.name; // Sla de naam tijdelijk op
  //     };
  //     reader.readAsDataURL(file); // Lees bestand als Base64
  //   }
  // }
  
  // sendEmailWithAttachment() {
  //   this.emailComposer.isAvailable().then((available: boolean) => {
  //     if (available) {
  //       const email = {
  //         to: 'arno_stas@hotmail.com',
  //         subject: 'Factuur',
  //         body: 'Hier is de factuur als bijlage.',
  //         attachments: [
  //           this.fileData // Base64-string als bijlage
  //         ],
  //         isHtml: true,
  //       };
  
  //       this.emailComposer.open(email).then(() => {
  //         console.log('E-mail geopend');
  //       });
  //     }
  //   });
  // }


  // async uploadFile() {
  //   if (!this.selectedFile || !this.absoluteFilePath) return;
  //   EmailComposer.open({
  //     to: ["arno_stas@hotmail.com"],
  //     // to:["vander-mynsbrugge-ludwina@yukiworks.be"],
  //     // cc:["arno_stas@hotmail.com"],
  //     attachments: [{
  //       type: 'absolute',
  //       path: ,
  //     }]
  //   })

  // const filePath = `documents/${this.selectedFile.name}`;
  // const fileRef = this.storage.ref(filePath);
  // const task = this.storage.upload(filePath, this.selectedFile);

  // task
  //   .snapshotChanges()
  //   .pipe(
  //     finalize(async () => {
  //       const downloadURL = await fileRef.getDownloadURL().toPromise();
  //       this.documentService.addDocument(this.selectedFile!.name, downloadURL);
  //     })
  //   )
  //   .subscribe();
// }

  // resolveFilePath(file: File): void {
  //   this.selectedFile?.resolveLocalFilesystemUrl().then(url => {
  //     this.absoluteFilePath = url;
  //   })
  // }
}
