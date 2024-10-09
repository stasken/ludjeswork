import { Component, OnInit } from '@angular/core';
import { ShiftsService } from 'src/app/services/shifts.service';

export class ShiftItem {
  id: string = "";
  location: string;
  platform: string;
  accepted: boolean;
  break: number;
  earnings: number;
  enddate: Date;
  startdate: Date;

  constructor(location: string, platform: string, accepted: boolean, breakMinutes: number, earnings: number,
    enddate: Date, startdate: Date
  ) {
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
  shiftMap: Map<string, ShiftItem>;

  constructor(private shiftService: ShiftsService) {
    this.shiftMap = new Map(this.futureShifts.map(item => [item.id, item]));
  }

  ngOnInit() {
    this.shiftService.getAllShifts().then((res) => {
      res.forEach((shift) => {
        let shiftItem: ShiftItem = new ShiftItem(shift.location, shift.platform, shift.accepted, shift.break, shift.earnings, shift.enddate.toDate(), shift.startdate.toDate());
        this.futureShifts.push(shiftItem);
      })
    })
  }

  checkChanges(shift: ShiftItem) {
    const foundShift = this.shiftMap.get(shift.id);
    if (foundShift) {
      const isChanged =
        foundShift.platform !== shift.platform ||
        foundShift.location !== shift.location ||
        foundShift.startdate.getTime() !== shift.startdate.getTime() ||
        foundShift.enddate.getTime() !== shift.enddate.getTime() ||
        foundShift.earnings !== shift.earnings ||
        foundShift.accepted !== shift.accepted ||
        foundShift.break !== shift.break;

      // If changes are detected, add the shift to the changedShifts array
      if (isChanged) {
        this.changedShifts.push(shift);
      }
    }
  }


  saveAll() {
    // console.log(this.changedShifts);
    // this.shiftService.save
  }
}


