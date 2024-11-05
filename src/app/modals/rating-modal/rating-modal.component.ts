import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-rating-modal',
  templateUrl: './rating-modal.component.html',
  styleUrls: ['./rating-modal.component.scss'],
})
export class RatingModalComponent implements OnInit {
  @Input() currentRating: number = 0;
  @Input() currentAverageRating: number = 0;
  @Input() currentLocation: string = "";

  selectedRating: number = 0;
  currentAverage: string = "";

  constructor(private modalController: ModalController) { }
  ngOnInit() {
    if (this.currentAverageRating || this.currentAverageRating == 0) {
      this.currentAverage = `Nog geen rating`
    } else {
      this.currentAverage = `Gemiddelde: ${this.currentAverage} / 5`
    }
    this.selectedRating = this.currentRating;
  }

  saveRating() {
    this.modalController.dismiss(this.selectedRating);
  }

  cancel() {
    this.modalController.dismiss();
  }
}
