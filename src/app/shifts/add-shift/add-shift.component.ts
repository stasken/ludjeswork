import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CalculationService } from 'src/app/services/calculation-service';
import { ShiftsService } from 'src/app/services/shifts.service';
import { ShiftItem } from '../shift-list/shift-list.component';

@Component({
  selector: 'app-add-shift',
  templateUrl: './add-shift.component.html',
  styleUrls: ['./add-shift.component.scss'],
})
export class AddShiftComponent implements OnInit {
  shiftForm!: FormGroup;

  totalMinutes: number = 0;
  startDate!: Date;
  endDate!: Date;
  currentBreakMinutes: number = 0;
  selectedPlatform!: string;
  earnings: number = 0;
  earningsNetto: number = 0;
  futureShifts: ShiftItem[] = [];

  constructor(private fb: FormBuilder, private shiftService: ShiftsService, private calculations: CalculationService, private router: Router, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.initializeForm();
    this.subscribeToFormChanges();
    this.getAllShifts();
  }

  initializeForm() {
    this.shiftForm = this.fb.group({
      platform: ['', Validators.required],
      location: ['', Validators.required],
      startDate: ['', Validators.required],
      earnings: ['',],
      endDate: ['', Validators.required],
      break: ['', [Validators.required, Validators.min(0)]],
      accepted: [false]
    });
  }

  getAllShifts() {
    this.shiftService.getAllFutureShifts().then((res) => {
      this.futureShifts = [];
      res.forEach((shift) => {
        let shiftItem: ShiftItem = new ShiftItem(shift.id ?? "", shift.location, shift.platform, shift.accepted, shift.break, shift.earnings, shift.enddate.toDate(), shift.startdate.toDate());
        this.futureShifts.push(shiftItem);
      })
    })
  }

  subscribeToFormChanges() {
    this.shiftForm.get('platform')?.valueChanges.subscribe((value) => {
      this.selectedPlatform = value;
      this.earningsNetto = this.calculations.calculateEarnings(this.endDate, this.startDate, this.totalMinutes, this.currentBreakMinutes, this.selectedPlatform, this.earnings);
      this.changeDetector.detectChanges();
    });
    this.shiftForm.get('earnings')?.valueChanges.subscribe((value) => {
      this.earnings = value;
      this.earningsNetto = this.calculations.calculateEarnings(this.endDate, this.startDate, this.totalMinutes, this.currentBreakMinutes, this.selectedPlatform, this.earnings);
      this.changeDetector.detectChanges();
    });

    this.shiftForm.get('startDate')?.valueChanges.subscribe((value) => {
      this.startDate = new Date(value);
      this.setEndDate();
      this.totalMinutes = this.calculations.calculateHours(this.endDate, this.startDate, this.currentBreakMinutes)
      this.checkNettoPrice();
    });
    this.shiftForm.get('endDate')?.valueChanges.subscribe((value) => {
      this.endDate = new Date(value);
      if (this.startDate) {
        this.setEndDate();
        this.totalMinutes = this.calculations.calculateHours(this.endDate, this.startDate, this.currentBreakMinutes)
        this.checkNettoPrice();
      }
    });

    this.shiftForm.get('break')?.valueChanges.subscribe((value) => {
      this.currentBreakMinutes = value;
      this.totalMinutes = this.calculations.calculateHours(this.endDate, this.startDate, this.currentBreakMinutes)
      this.checkNettoPrice();
    });
  }

  setEndDate() {
    if (!this.startDate || !this.endDate) return;
    let adjustedEnd = new Date(this.startDate);
    adjustedEnd.setHours(this.endDate.getHours(), this.endDate.getMinutes(), 0, 0); // Set the correct hours and minutes
    if (adjustedEnd <= this.startDate) {
      adjustedEnd.setDate(adjustedEnd.getDate() + 1); // Move to the next day
    }
    this.endDate = adjustedEnd;
  }

  checkNettoPrice() {
    if (this.selectedPlatform === 'X-Care') {
      this.earningsNetto = this.calculations.calculatePriceX(this.startDate, this.endDate, this.currentBreakMinutes, this.totalMinutes);
    } else if (this.selectedPlatform === 'Beeple') {
      this.earningsNetto = this.calculations.calculatePriceBeeple(this.startDate, this.endDate, this.currentBreakMinutes, this.totalMinutes);
    }
    this.changeDetector.detectChanges();
  }

  async onSubmit() {
    if (this.shiftForm.valid) {
      let start = this.startDate;
      let end = this.endDate;
      let noOverlap = this.calculations.checkForOverlap(start, end, this.futureShifts);
      if (noOverlap.status === 0) {
        let day = this.startDate.getDay();
        let startHour = this.startDate.getHours();
        if ((day === 1 || day === 4) && startHour >= 12) {
          if (window.confirm(`Arno moet coachen die avond. Zeker dat u dit wilt doen?`)) {
            this.addShiftToDb(start, end);
          }
        } else {
          this.addShiftToDb(start, end);
        }
      } else if (noOverlap.status === 1) {
        window.alert(noOverlap.statusText);
      } else if (noOverlap.status === 2 || noOverlap.status === 3) {
        if (window.confirm(`${noOverlap.statusText}\nZeker dat u dit wilt doen?`)) {
          this.addShiftToDb(start, end);
        }
      }
    }
  }

  async addShiftToDb(start: Date, end: Date) {
    let start_timestamp = Timestamp.fromDate(start)
    let end_timestamp = Timestamp.fromDate(end)

    await this.shiftService.addShift({
      location: this.shiftForm.get("location")?.value,
      platform: this.shiftForm.get("platform")?.value,
      accepted: this.shiftForm.get("accepted")?.value,
      break: this.shiftForm.get("break")?.value,
      earnings: this.earningsNetto,
      enddate: end_timestamp,
      startdate: start_timestamp
    }).then((res) => {
      this.router.navigate(['/tabs/shiften']);
    }).catch((error) => {
      console.log(error)
    })
  }
  
}
