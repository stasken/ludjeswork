import { Component, OnInit } from '@angular/core';
import { ShiftsService } from 'src/app/services/shifts.service';

export class ShiftItem {
  id: string;
  location: string;
  platform: string;
  accepted: boolean;
  break: number;
  earnings: number;
  enddate: Date;
  startdate: Date;

  constructor(id: string, location: string, platform: string, accepted: boolean, breakMinutes: number, earnings: number,
    enddate: Date, startdate: Date
  ) {
    this.id = id;
    this.location = location;
    this.platform = platform;
    this.accepted = accepted;
    this.break = breakMinutes;
    this.earnings = earnings;
    this.enddate = enddate;
    this.startdate = startdate;
  }

}

@Component({
  selector: 'app-shift-list',
  templateUrl: './shift-list.component.html',
  styleUrls: ['./shift-list.component.scss'],
})
export class ShiftListComponent implements OnInit {
  futureShifts: ShiftItem[] = [];
  changedShifts: ShiftItem[] = [];
  shiftMap!: Map<string, ShiftItem>;

  constructor(private shiftService: ShiftsService) {
  }

  ngOnInit() {
    this.shiftService.getAllShifts().then((res) => {
      res.forEach((shift) => {
        let shiftItem: ShiftItem = new ShiftItem(shift.id ?? "",shift.location, shift.platform, shift.accepted, shift.break, shift.earnings, shift.enddate.toDate(), shift.startdate.toDate());
        this.futureShifts.push(shiftItem);
      })
      this.shiftMap = new Map(this.futureShifts.map(item => [item.id, item]));
    })
  }

  checkChanges(shift: ShiftItem) {
    const foundShift = this.shiftMap.get(shift.id);
    
    if (foundShift) {
      const isChanged =
        foundShift.earnings !== shift.earnings ||
        foundShift.accepted !== shift.accepted ||
        foundShift.break !== shift.break;

      if (isChanged) {
        const entryIndex = this.changedShifts.findIndex(entry => entry.id === shift.id);
        if (entryIndex > -1) {
          this.changedShifts[entryIndex] = shift;
        } else {
          this.changedShifts.push(shift);
        }
        this.changedShifts.push(shift);
      }
    }
  }
}


