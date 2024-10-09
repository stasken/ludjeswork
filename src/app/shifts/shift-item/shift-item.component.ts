import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-shift-item',
  templateUrl: './shift-item.component.html',
  styleUrls: ['./shift-item.component.scss'],
})
export class ShiftItemComponent  implements OnInit {
  @Input() shift: any;
  @Output() updateShift = new EventEmitter<any>();

  dateToString!: string;
  timeToString!: string;

  onShiftChange() {
    this.updateShift.emit(this.shift);
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
}
