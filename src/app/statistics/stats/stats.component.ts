import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CalculationService } from 'src/app/services/calculation-service';
import { ShiftsService } from 'src/app/services/shifts.service';
import { Shift } from 'src/models/shift';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
  countShifts: number = 0;
  countHours: string = "";
  earnings: string = "";
  earningsPlusNA: string = "";

  paramsSub!: Subscription;

  currentYear: number;
  currentMonth: number;

  startPeriod!: Date;
  endPeriod!: Date;

  beginDatetime!: string;
  endDatetime!: string;

  showBeginDatePicker = false;
  showEndDatePicker = false;

  constructor(private shiftService: ShiftsService, private calcs: CalculationService, private route: ActivatedRoute) {
    this.currentYear = new Date().getFullYear();
    this.currentMonth = new Date().getMonth();

    this.setCurrentMonthPeriod()
  }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.getShiftsForPeriod();
    })
  }

  getShiftsForPeriod() {
    this.shiftService.getShiftsByPeriod(this.startPeriod, this.endPeriod).then(res => {
      let stats = this.getShiftStats(res);
      this.countShifts = stats.shiftCount;
      this.countHours = `${(stats.totalHours / 60).toFixed(2)} uren`;
      this.earnings = `€ ${stats.totalEarnings.toFixed(2)}`;
      this.earningsPlusNA = `€ ${stats.totalEarningsNA.toFixed(2)}`;
    })
  }

  getShiftStats(shifts: Shift[]): { shiftCount: number, totalHours: number, totalEarnings: number, totalEarningsNA: number } {
    const result = shifts.reduce((acc, shift) => {
      acc.totalEarningsNA += shift.earnings;
      if (shift.accepted) {
        let minutes = this.calcs.calculateHours(shift.enddate.toDate(), shift.startdate.toDate(), shift.break)
        acc.shiftCount += 1;
        acc.totalHours += minutes;
        acc.totalEarnings += shift.earnings;
      }
      return acc;
    }, { shiftCount: 0, totalHours: 0, totalEarningsNA: 0, totalEarnings: 0 });

    return result;
  }

  setCurrentMonthPeriod() {
    this.startPeriod = new Date(this.currentYear, this.currentMonth, 1, 5);
    this.endPeriod = new Date(this.currentYear, this.currentMonth + 1, 0, 3);

    this.beginDatetime = this.startPeriod.toISOString();
    this.endDatetime = this.endPeriod.toISOString();
    this.getShiftsForPeriod();
  }

  goToPreviousMonth() {
    this.currentMonth--;
    if (this.currentMonth == 0) {
      this.currentMonth = 1;
      this.currentYear--;
    }
    this.setCurrentMonthPeriod();
  }
  
  goToNextMonth() {
    this.currentMonth++;
    if (this.currentMonth + 1 == 13) {
      this.currentMonth = 1;
      this.currentYear++;
    }
    this.setCurrentMonthPeriod();
  }

  saveBeginPeriod() {
    this.startPeriod = new Date(this.beginDatetime);
    this.currentMonth = this.startPeriod.getMonth();
    this.currentYear = this.startPeriod.getFullYear();
    this.showBeginDatePicker = false;
    this.getShiftsForPeriod();
  }
  saveEndPeriod() {
    this.endPeriod = new Date(this.endDatetime);
    this.showEndDatePicker = false;
    this.getShiftsForPeriod();
  }
}
