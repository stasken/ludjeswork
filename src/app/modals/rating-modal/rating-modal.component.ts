import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ShiftItem } from 'src/app/components/shifts/shift-list/shift-list.component';
import { ShiftsService } from 'src/app/services/shifts.service';

@Component({
  selector: 'app-rating-modal',
  templateUrl: './rating-modal.component.html',
  styleUrls: ['./rating-modal.component.scss'],
})
export class RatingModalComponent implements OnInit {
  @Input() shift!: ShiftItem;
  @Input() currentAverageRating: number = 0;

  currentLocation: string = "";
  selectedRating: number = 0;
  currentAverage: string = "";

  constructor(private modalController: ModalController, private shiftService: ShiftsService) { }
  ngOnInit() {
    if (this.currentAverageRating || this.currentAverageRating == 0) {
      this.currentAverage = `Nog geen rating`
    } else {
      this.currentAverage = `Gemiddelde: ${this.currentAverage} / 5`
    }
    this.selectedRating = this.shift.rating;
  }

  saveRating() {
    if (this.shift && this.shift.id) {
      this.shiftService.updateShiftRating(this.shift.id ?? "", this.selectedRating).then(() => {
        this.modalController.dismiss(true);
      }).catch((err) => {
        this.modalController.dismiss(false);
        console.log("error: ", err);
      });
    }
  }

  cancel() {
    this.modalController.dismiss();
  }
}
