import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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
  currentFilteredShifts: ShiftItem[] = [];
  shiftMap!: Map<string, ShiftItem>;

  paramsSub!: Subscription;

  constructor(private shiftService: ShiftsService, private route : ActivatedRoute) {
  }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      console.log(params);
      this.getAllShifts();
    })
  }

  getAllShifts() {
    this.shiftService.getAllFutureShifts().then((res) => {
      this.futureShifts = [];
      res.forEach((shift) => {
        let shiftItem: ShiftItem = new ShiftItem(shift.id ?? "",shift.location, shift.platform, shift.accepted, shift.break, shift.earnings, shift.enddate.toDate(), shift.startdate.toDate());
        this.futureShifts.push(shiftItem);
      })
      this.shiftMap = new Map(this.futureShifts.map(item => [item.id, item]));
      this.currentFilteredShifts = this.futureShifts.slice(0);
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

  deleteShift(shift:ShiftItem) {
    const index = this.currentFilteredShifts.indexOf(shift, 0);
    if (index > - 1) {
      this.currentFilteredShifts.splice(index, 1);
    }
  }
}


