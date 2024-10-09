import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ShiftsService } from 'src/app/services/shifts.service';
import { Shift } from 'src/models/shift';

@Component({
  selector: 'app-add-shift',
  templateUrl: './add-shift.component.html',
  styleUrls: ['./add-shift.component.scss'],
})
export class AddShiftComponent implements OnInit {
  shiftForm!: FormGroup;

  constructor(private fb: FormBuilder, private shiftService: ShiftsService, private router: Router) { }

  ngOnInit() {
    this.initializeForm();
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

  async onSubmit() {
    if (this.shiftForm.valid) {
      console.log(this.shiftForm.value);
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
