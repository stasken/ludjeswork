import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ShiftItem } from 'src/app/components/shifts/shift-list/shift-list.component';
import { LocationsService } from 'src/app/services/locations.service';
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

  constructor(private modalController: ModalController, private shiftService: ShiftsService, private locationService: LocationsService) { }
  ngOnInit() {
    if (this.currentAverageRating || this.currentAverageRating == 0) {
      this.currentAverage = `Nog geen rating`
    } else {
      this.currentAverage = `Gemiddelde: ${this.currentAverage} / 5`
    }
    this.selectedRating = this.shift.rating;
  }

  saveRating() {
    let update = 2;
    if (this.shift && this.shift.id) {
      this.shiftService.updateShiftRating(this.shift.id ?? "", this.selectedRating).then(() => {
        let loc = this.shift.location;
        if (this.shift.rating != 0) {
          let pr = (loc.totalWorkedShifts * loc.averageRating);
          let dd = (pr - this.shift.rating);
          let aa = (dd + this.selectedRating);
          let newAvg = aa / loc.totalWorkedShifts;
          this.shift.rating = this.selectedRating;
          loc.averageRating = Math.round(newAvg * 100) / 100;
          update = 0;
        } else {
          let newAvg = ((loc.totalWorkedShifts * loc.averageRating) + this.selectedRating) / (loc.totalWorkedShifts + 1)
          this.shift.rating = newAvg;
          loc.averageRating = Math.round(newAvg * 100) / 100;
          loc.totalWorkedShifts = + 1;
          loc.totalEarned = + this.shift.earnings;
          update = 1;
        }

        this.locationService.updateLocation(loc)
        this.modalController.dismiss({ update: update, newRating: this.shift.rating, newAvgRating: loc.averageRating });
      }).catch((err) => {
        this.modalController.dismiss({ update: update, newRating: this.shift.rating, newAvgRating: 0 });
        console.log("error: ", err);
      });
    }
  }

  cancel() {
    this.modalController.dismiss({ update: 3, newRating: this.shift.rating, newAvgRating: 0 });
  }
}
