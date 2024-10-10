import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CalculationService } from 'src/app/services/calculation-service';
import { ShiftsService } from 'src/app/services/shifts.service';

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

  constructor(private fb: FormBuilder, private shiftService: ShiftsService, private calculations: CalculationService, private router: Router, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.initializeForm();
    this.subscribeToFormChanges();
  }

  initializeForm() {
    this.shiftForm = this.fb.group({
      platform: ['', Validators.required],
      location: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      break: ['', [Validators.required, Validators.min(0)]],
      earnings: ['', [Validators.required, Validators.min(0)]],
      accepted: [false]
    });
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
      if (this.endDate) {
        this.endDate.setMonth(new Date(value).getMonth());
        this.endDate.setDate(new Date(value).getDate());
      }
      this.totalMinutes = this.calculations.calculateHours(this.endDate, this.startDate, this.currentBreakMinutes, this.selectedPlatform)
      this.checkNettoPrice();
    });
    this.shiftForm.get('endDate')?.valueChanges.subscribe((value) => {
      this.endDate = new Date(value);
      if (this.startDate) {
        this.endDate.setMonth(this.startDate.getMonth());
        this.endDate.setDate(this.startDate.getDate());
      }
      this.totalMinutes = this.calculations.calculateHours(this.endDate, this.startDate, this.currentBreakMinutes, this.selectedPlatform)
      this.checkNettoPrice();
    });

    this.shiftForm.get('break')?.valueChanges.subscribe((value) => {
      this.currentBreakMinutes = value;
      this.totalMinutes = this.calculations.calculateHours(this.endDate, this.startDate, this.currentBreakMinutes, this.selectedPlatform)
      this.checkNettoPrice();
    });
  }

  checkNettoPrice() {
    if (this.selectedPlatform === 'X-Care') {
      this.earningsNetto = this.calculations.calculatePrice(this.startDate, this.endDate, this.currentBreakMinutes, this.totalMinutes);
      this.changeDetector.detectChanges();
    }
  }

  async onSubmit() {
    if (this.shiftForm.valid) {
      let start = new Date(this.shiftForm.get("startDate")?.value);
      let start_timestamp = Timestamp.fromDate(start)
      let end = new Date(this.shiftForm.get("endDate")?.value);
      let end_timestamp = Timestamp.fromDate(end)
      await this.shiftService.addShift({
        location: this.shiftForm.get("location")?.value,
        platform: this.shiftForm.get("platform")?.value,
        accepted: this.shiftForm.get("accepted")?.value,
        break: this.shiftForm.get("break")?.value,
        earnings: this.shiftForm.get("earnings")?.value,
        enddate: end_timestamp,
        startdate: start_timestamp
      }).then((res) => {
        this.router.navigate(['/tabs/shiften']);
      }).catch((error) => {
        console.log(error)
      })
    }
  }

}
