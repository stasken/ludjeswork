import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CalculationService } from 'src/app/services/calculation-service';
import { ShiftsService } from 'src/app/services/shifts.service';
import { ShiftItem } from '../shift-list/shift-list.component';
import { LocationsService } from 'src/app/services/locations.service';
import { Location } from 'src/models/location';
import { ViewDidEnter } from '@ionic/angular';

@Component({
  selector: 'app-add-shift',
  templateUrl: './add-shift.component.html',
  styleUrls: ['./add-shift.component.scss'],
})
export class AddShiftComponent implements OnInit, ViewDidEnter {
  shiftForm!: FormGroup;

  // Arrays
  futureShifts: ShiftItem[] = [];
  locations: Location[] = [];

  // Location autofill
  filteredLocations: Location[] = [];
  isOpenPopLocation = false;
  selectedLocation!: Location;

  // Inputs
  selectedPlatform!: string;
  currentBreakMinutes: number = 0;
  earnings: number = 0;

  // Calcs
  totalMinutes: number = 0;
  earningsNetto: number = 0;

  // START END
  showBeginDatePicker: boolean = false;
  showEndDatePicker: boolean = false;
  startDate!: Date;
  selectedStartHour = 0;
  selectedStartMinute = 0;
  endDate!: Date;
  selectedEndHour = 0;
  selectedEndMinute = 0;

  constructor(private fb: FormBuilder, private shiftService: ShiftsService, private locationService: LocationsService, private calculations: CalculationService, private router: Router, private changeDetector: ChangeDetectorRef) {
    this.initializeDates()
    this.initializeForm();
  }

  ngOnInit() {
    this.subscribeToFormChanges();
  }

  async ionViewDidEnter() {
    await this.getAllLocations()
    this.getAllShifts();
  }

  initializeDates() {
    let now = new Date();
    this.startDate = new Date();
    this.selectedStartHour = this.startDate.getHours();
    this.selectedStartMinute = this.startDate.getMinutes();
    this.endDate = new Date(now.setHours(now.getHours() + 8));
    this.selectedEndHour = this.endDate.getHours();
    this.selectedEndMinute = this.endDate.getMinutes();
  }

  initializeForm() {
    const formattedStartDate = this.startDate.toISOString().substring(0, 10);
    const formattedEndDate = this.endDate.toISOString().substring(0, 10);

    this.shiftForm = this.fb.group({
      platform: ['', Validators.required],
      location: ['', Validators.required],
      startDate: [formattedStartDate, Validators.required],
      startHour: [this.startDate.getHours(), [Validators.required, Validators.min(0), Validators.max(23)]],
      startMinute: [this.startDate.getMinutes(),[Validators.required, Validators.min(0), Validators.max(59)]],
      endDate: [formattedEndDate, Validators.required],
      endHour: [this.endDate.getHours(), [Validators.required, Validators.min(0), Validators.max(23)]],
      endMinute: [this.endDate.getMinutes(), [Validators.required, Validators.min(0), Validators.max(59)]],
      earnings: ['',],
      break: [0, [Validators.required, Validators.min(0)]],
      accepted: [false]
    });
  }

  getAllShifts() {
    this.shiftService.getAllFutureShifts().then((res) => {
      this.futureShifts = [];
      res.forEach((shift) => {
        let loc = this.locations.find(l => shift.locationId === l.id);
        let shiftItem: ShiftItem = new ShiftItem(shift.id ?? "", loc?.id ?? "", loc?.name ?? "", shift.platform, shift.comment, shift.accepted, shift.break, shift.earnings, shift.rating, shift.enddate.toDate(), shift.startdate.toDate());
        this.futureShifts.push(shiftItem);
      })
    })
  }

  async getAllLocations() {
    this.locationService.getAllLocations().then(locs => {
      this.locations = locs.map(loc =>
        new Location(loc.name, loc.town, loc.address, loc.totalWorkedShifts, loc.totalEarned, loc.averageRating)
      );

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
      let selectedDate = new Date(value);
      selectedDate.setHours(this.selectedStartHour);
      selectedDate.setMinutes(this.selectedStartMinute);
      this.startDate = selectedDate;
      this.setEndDate();
      this.totalMinutes = this.calculations.calculateHours(this.endDate, this.startDate, this.currentBreakMinutes)
      this.checkNettoPrice();
    });
    this.shiftForm.get('startHour')?.valueChanges.subscribe((value) => {
      if (value >= 0 && value < 24) {
        this.selectedStartHour = value;
        this.startDate.setHours(value);
        this.setEndDate();
        this.totalMinutes = this.calculations.calculateHours(this.endDate, this.startDate, this.currentBreakMinutes)
        this.checkNettoPrice();
      }
    });
    this.shiftForm.get('startMinute')?.valueChanges.subscribe((value) => {
      if (value >= 0 && value < 60) {
        this.selectedStartMinute = value;
        this.startDate.setMinutes(value);
        this.setEndDate();
        this.totalMinutes = this.calculations.calculateHours(this.endDate, this.startDate, this.currentBreakMinutes)
        this.checkNettoPrice();
      }
    });
    this.shiftForm.get('endDate')?.valueChanges.subscribe((value) => {
      this.endDate = new Date(value);
      if (this.startDate) {
        this.setEndDate();
        this.totalMinutes = this.calculations.calculateHours(this.endDate, this.startDate, this.currentBreakMinutes)
        this.checkNettoPrice();
      }
    });
    this.shiftForm.get('endHour')?.valueChanges.subscribe((value) => {
      this.selectedEndHour = value;
      if (this.startDate) {
        this.setEndDate();
        this.totalMinutes = this.calculations.calculateHours(this.endDate, this.startDate, this.currentBreakMinutes)
        this.checkNettoPrice();
      }
    });
    this.shiftForm.get('endMinute')?.valueChanges.subscribe((value) => {
      this.selectedEndMinute = value;
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
    this.shiftForm.get('location')?.valueChanges.subscribe((value) => {
      this.filterLocations(value);
    });
  }

  presentPopLocation() {
    this.isOpenPopLocation = !this.isOpenPopLocation;
  }

  locationSelected(item: Location) {
    this.selectedLocation = item;
    this.isOpenPopLocation = false;
    this.shiftForm.controls['location'].setValue(item);
  }

  filterLocations(value: any) {
    this.isOpenPopLocation = true;
    if (value instanceof Location) {
      this.isOpenPopLocation = false;
    }
    if (value && value.trim() !== '') {
      const query = value.toLowerCase();
      this.filteredLocations = this.locations.filter(loc => {
        return loc.toString().toLowerCase().includes(query)
      });
    } else {
      this.filteredLocations = [];
    }
  }

  setEndDate() {
    if (!this.startDate || !this.endDate) return;
    let adjustedEnd = new Date(this.startDate);
    adjustedEnd.setHours(this.selectedEndHour, this.selectedEndMinute, 0, 0); // Set the correct hours and minutes
    if (adjustedEnd <= this.startDate) {
      adjustedEnd.setDate(this.startDate.getDate() + 1); // Move to the next day
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
    let locationId = "";

    if (!this.selectedLocation) {
      let inputLocation = this.shiftForm.get('location')?.value;
      const regex = /^([^\d]+),\s*(.+)$/;
      const match = inputLocation.match(regex);
      if (match) {
        const town = match[1].trim();
        const name = match[2].trim();
        await this.locationService.addLocation({
          name: name,
          town: town,
          address: "",
          totalWorkedShifts: 0,
          totalEarned: 0,
          averageRating: 0
        }).then(docRef => {
          locationId = docRef.id;
        }).catch(error => {
          console.error("Error adding location:", error);
          window.alert("Er is een fout opgetreden bij het toevoegen van de locatie.");
          return;
        })
      } else {
        window.alert("Geen correcte manier van Stad en Naam.\nTussen stad en naam een komma plaatsen.\nVoorbeeld: Gent, Vulpia Vroonstalle")
        return;
      }
    } else {
      locationId = this.selectedLocation.id ?? "";
    }
    await this.shiftService.addShift({
      locationId: locationId,
      platform: this.shiftForm.get("platform")?.value,
      accepted: this.shiftForm.get("accepted")?.value,
      break: this.shiftForm.get("break")?.value,
      comment: "",
      rating: 0,
      earnings: this.earningsNetto,
      enddate: end_timestamp,
      startdate: start_timestamp
    }).then((res) => {
      this.router.navigate(['/shiften']);
    }).catch((error) => {
      console.log(error)
    })
  }

}
