import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RatingModalComponent } from 'src/app/modals/rating-modal/rating-modal.component';
import { ShiftsService } from 'src/app/services/shifts.service';
import { ShiftItem } from '../shift-list/shift-list.component';

@Component({
  selector: 'app-shift-item',
  templateUrl: './shift-item.component.html',
  styleUrls: ['./shift-item.component.scss'],
})
export class ShiftItemComponent implements OnInit {
  @Input() shift!: ShiftItem;
  @Output() refreshShiftEmitter = new EventEmitter<any>();
  @Output() updateShiftEmitter = new EventEmitter<any>();
  @Output() deleteShiftEmitter = new EventEmitter<any>();

  dateToString!: string;
  timeToString!: string;

  locationTitle: string = "";

  // SAVE
  @ViewChild('saveBtn', { static: false }) saveButton!: ElementRef<HTMLButtonElement>;

  constructor(private shiftService: ShiftsService, private modalController: ModalController) {
  }

  ngOnChanges(changes: SimpleChanges) {
    let shift = changes['shift'].currentValue;
    this.locationTitle = `\u2606 ${shift.location.averageRating} ${shift.location.town}, ${shift.location.name}`;
  }

  onShiftChange() {
    this.updateShiftEmitter.emit(this.shift);
    if (this.saveButton && this.saveButton.nativeElement) {
      this.saveButton.nativeElement.disabled = false;
      // this.saveButton.nativeElement.style.background = "#88888855"
    }
  }

  ngOnInit(): void {
    this.getFormattedDateRange();
  }

  getFormattedDateRange() {
    const startDate = new Date(this.shift.startdate);
    const endDate = new Date(this.shift.enddate);

    const day = startDate.getDate();
    const month = startDate.toLocaleString('default', { month: 'short' });
    const startHour = startDate.getHours().toString().padStart(2, '0');
    const startMinute = startDate.getMinutes().toString().padStart(2, '0');
    const endHour = endDate.getHours().toString().padStart(2, '0');
    const endMinute = endDate.getMinutes().toString().padStart(2, '0');

    this.dateToString = `${day} ${month}`
    this.timeToString = `${startHour}:${startMinute} - ${endHour}:${endMinute}`;
  }

  saveShift(btn: HTMLButtonElement) {
    this.shiftService.updateShift(this.shift).then(() => {
      btn.classList.add('success');
      this.animateButton(btn, true);
    }).catch(() => {
      btn.classList.add('error');
      this.animateButton(btn, false);
    });
  }

  deleteShift(btn: HTMLButtonElement) {
    if (window.confirm('Zeker dat je deze shift wilt verwijderen?')) {
      this.shiftService.deleteShift(this.shift).then(() => {
        this.deleteShiftEmitter.emit(this.shift);
        btn.classList.add('success');
        this.animateButton(btn, true);
      }).catch(() => {
        btn.classList.add('error');
        this.animateButton(btn, false);
      });
    }
  }

  animateButton(e: any, succes: boolean) {
    e.preventDefault;
    e.classList.remove('animate');
    e.classList.add('animate');
    if (succes) {
      setTimeout(function () {
        e.classList.remove('buttonNormal');
        e.classList.add('buttonSuccess');
      }, 1500);
    }
    setTimeout(function () {
      e.classList.remove('animate');
      e.classList.remove('buttonSuccess');
      e.classList.add('buttonNormal');
    }, 3500);
  };

  // rating
  async openRatingModal() {
    const modal = await this.modalController.create({
      component: RatingModalComponent,
      componentProps: { shift: this.shift, currentAverageRating: this.shift.location.averageRating },
    });

    modal.onDidDismiss().then((data) => {
      let update = data.data.update;
      let newRating = data.data.newRating;
      let newAvgRating = data.data.newAvgRating;
      this.shift.location.averageRating = newAvgRating;
      this.locationTitle = `\u2606 ${this.shift.location.averageRating} ${this.shift.location.town}, ${this.shift.location.name}`;
      switch (update) {
        case 0:
          this.shift.rating = newRating;
          this.updateShiftEmitter.emit(this.shift)
          break;
        case 1:
          this.refreshShiftEmitter.emit();
          break;
        case 2:
          this.deleteShiftEmitter.emit(this.shift);
          break;
        // error
        case 3:
          this.deleteShiftEmitter.emit(this.shift);
          break;
        default:
      }
    });

    return await modal.present();
  }
}
