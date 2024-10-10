import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ShiftsService } from 'src/app/services/shifts.service';

@Component({
  selector: 'app-shift-item',
  templateUrl: './shift-item.component.html',
  styleUrls: ['./shift-item.component.scss'],
})
export class ShiftItemComponent implements OnInit {
  @Input() shift: any;
  @Output() updateShift = new EventEmitter<any>();
  @Output() saveUpdateShift = new EventEmitter<any>();

  dateToString!: string;
  timeToString!: string;

  // SAVE
  @ViewChild('saveBtn', { static: false }) saveButton!: ElementRef<HTMLButtonElement>;

  constructor(private shiftService: ShiftsService) {
  }

  onShiftChange() {
    this.updateShift.emit(this.shift);
    if (this.saveButton && this.saveButton.nativeElement) {
      this.saveButton.nativeElement.style.background = "#88888855"
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

  animateButton(e: any, succes: boolean) {
    e.preventDefault;
    e.classList.remove('animate');
    e.classList.add('animate');
    if (succes) {
      setTimeout(function () {
        e.classList.add('buttonSuccess');
      }, 1500);
    }
    setTimeout(function () {
      e.classList.remove('animate');
      e.classList.remove('buttonSuccess');
      e.classList.add('buttonNormal');
    }, 3500);
  };
}
