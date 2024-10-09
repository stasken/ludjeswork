import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShiftsService } from 'src/app/services/shifts.service';
import { Shift } from 'src/models/shift';

@Component({
  selector: 'app-add-shift',
  templateUrl: './add-shift.component.html',
  styleUrls: ['./add-shift.component.scss'],
})
export class AddShiftComponent implements OnInit {
  shiftForm!: FormGroup;

  constructor(private fb: FormBuilder, private shiftService: ShiftsService) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.shiftForm = this.fb.group({
      date: ['', Validators.required],
      startHour: ['', Validators.required], 
      endHour: ['', Validators.required],
      break: [0, [Validators.required, Validators.min(0)]],
      platform: ['', Validators.required],
      amountEarned: [0, [Validators.required, Validators.min(0)]],
      accepted: [false]
    });
  }

  async onSubmit() {
    if (this.shiftForm.valid) {
      console.log(this.shiftForm.value);
      await this.shiftService.addShift({
        location: "tring",
        platform: "string",
        accepted: false,
        break: 30,
        earnings: 500,
        enddate: Timestamp.now(),
        startdate: Timestamp.now()
      }).then((res) => {
        console.log(res)
        console.log("x")
      }).catch((error) => {
        console.log("err");
        console.log(error)
      })
    }
  }

}
