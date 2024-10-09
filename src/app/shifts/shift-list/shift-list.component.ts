import { Component, OnInit } from '@angular/core';
import { ShiftsService } from 'src/app/services/shifts.service';

export class ShiftItem {
    id?: string;
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
export class ShiftListComponent  implements OnInit {
  futureShifts: ShiftItem[] = [];

  constructor(private shiftService: ShiftsService) { }

  ngOnInit() {
    this.shiftService.getAllFutureShifts().then((res) => {
      res.forEach((shift) => {
        let shiftItem: ShiftItem = new ShiftItem(shift.location, shift.platform, shift.accepted, shift.break, shift.earnings, shift.enddate.toDate(), shift.startdate.toDate());
        this.futureShifts.push(shiftItem);
      })
    })
  }

}
