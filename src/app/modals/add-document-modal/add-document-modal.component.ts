import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { IonInput, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-document-modal',
  templateUrl: './add-document-modal.component.html',
  styleUrls: ['./add-document-modal.component.scss'],
})
export class AddDocumentModalComponent implements OnInit {
  @ViewChild('filename') filename: IonInput | undefined;

  // Image
  currentImage!: string;
  imageData: string | undefined;

  // File
  fileData: string = ''; // Base64-string voor tijdelijk lokaal gebruik
  fileName: string = ''; // Naam van het bestand

  isImage = false;
  constructor(private modalController: ModalController) { }

  ngOnInit() { }

  async uploadFile(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.isImage = false;
      const reader = new FileReader();
      reader.readAsDataURL(file); // Lees bestand als Base64
      reader.onload = () => {
        this.fileData = reader.result as string; // Base64-string
        this.fileName = file.name;
      };
    }
  }

  async captureImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    })

    this.imageData = image.base64String;
    this.currentImage = `data:image/jpeg;base64,${image.base64String}`
    this.isImage = true;
    this.fileName = "";
    if (this.filename) this.filename.setFocus();
  }

  sendFile() {
    if (this.isImage) {
      const regex = /^[a-zA-Z0-9-]{3,}$/;
      const match = this.fileName.match(regex);
      if (!match) {
        window.alert("Geen geldige naam, enkel letters en cijfers en '-' en minimum 3 letters.");
        return;
      }
      this.modalController.dismiss({ isImage: true, fileName: this.fileName, fileData: this.imageData });
    } else {
      this.modalController.dismiss({ isImage: false, fileName: this.fileName, fileData: this.fileData });
    }
  }
  cancel() {
    this.modalController.dismiss();
  }

}
