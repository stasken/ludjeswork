import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShiftsService } from 'src/app/services/shifts.service';
import { Shift } from 'src/models/shift';

export class ShiftItem {
  id: string;
  location: string;
  comment: string;
  platform: string;
  accepted: boolean;
  break: number;
  earnings: number;
  rating: number;
  enddate: Date;
  startdate: Date;
  completed: boolean;

  constructor(id: string, location: string, platform: string, comment: string, accepted: boolean, breakMinutes: number, earnings: number, rating: number,
    enddate: Date, startdate: Date
  ) {
    this.id = id;
    this.location = location;
    this.platform = platform;
    this.comment = comment;
    this.accepted = accepted;
    this.break = breakMinutes;
    this.earnings = earnings;
    this.rating = rating;
    this.enddate = enddate;
    this.startdate = startdate;
    this.completed = this.startdate < new Date();
  }

}

@Component({
  selector: 'app-shift-list',
  templateUrl: './shift-list.component.html',
  styleUrls: ['./shift-list.component.scss'],
})
export class ShiftListComponent implements OnInit {
  futureShifts: ShiftItem[] = [];
  currentFilteredShifts: ShiftItem[] = [];
  shiftMap!: Map<string, ShiftItem>;

  paramsSub!: Subscription;

  // filter
  startPeriod: Date;
  endPeriod: Date;

  beginDatetime: string;
  endDatetime: string;

  showBeginDatePicker = false;
  showEndDatePicker = false;

  onlyPending = false;

  constructor(private shiftService: ShiftsService, private route: ActivatedRoute) {
    this.startPeriod = new Date();
    this.endPeriod = new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0, 3); //  last day of current month

    this.beginDatetime = this.startPeriod.toISOString();
    this.endDatetime = this.endPeriod.toISOString();
  }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.getShiftsByPeriod();
    })
  }

  // getAllShifts() {
  //   this.shiftService.getAllFutureShifts().then((res) => {
  //     this.setCurrentShifts(res);
  //   })
  // }

  getShiftsByPeriod() {
    this.shiftService.getShiftsByPeriod(this.startPeriod, this.endPeriod).then((res) => {
      this.setCurrentShifts(res);
    })
  }

  setCurrentShifts(shifts: Shift[]) {
    this.futureShifts = [];
    shifts.forEach((shift) => {
      let shiftItem: ShiftItem = new ShiftItem(shift.id ?? "", shift.location, shift.platform, shift.comment, shift.accepted, shift.break, shift.earnings, shift.rating, shift.enddate.toDate(), shift.startdate.toDate());
      this.futureShifts.push(shiftItem);
    })
    this.shiftMap = new Map(this.futureShifts.map(item => [item.id, item]));
    this.currentFilteredShifts = this.futureShifts.slice(0);
  }

  checkChanges(shift: ShiftItem) {
    const foundShift = this.shiftMap.get(shift.id);
    if (foundShift) {
      const isChanged =
        foundShift.earnings !== shift.earnings ||
        foundShift.accepted !== shift.accepted ||
        foundShift.break !== shift.break;

    }
  }

  deleteShift(shift: ShiftItem) {
    const index = this.currentFilteredShifts.indexOf(shift, 0);
    if (index > - 1) {
      this.currentFilteredShifts.splice(index, 1);
    }
  }

  // filter
  saveBeginPeriod() {
    this.startPeriod = new Date(this.beginDatetime);
    this.showBeginDatePicker = false;
    this.getShiftsByPeriod();
  }

  saveEndPeriod() {
    this.endPeriod = new Date(this.endDatetime);
    this.showEndDatePicker = false;
    this.getShiftsByPeriod();
  }

  changePending() {
    if (!this.onlyPending) {
      this.currentFilteredShifts = this.futureShifts.slice(0);
    } else {
      this.currentFilteredShifts = this.futureShifts.filter(shift => {
        return shift.accepted !== this.onlyPending;
      });
    }
  }
}


