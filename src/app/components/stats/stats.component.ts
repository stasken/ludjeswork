import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShiftsService } from 'src/app/services/shifts.service';
import { Shift } from 'src/models/shift';
import { Location } from 'src/models/location';
import { LocationsService } from 'src/app/services/locations.service';
import { CalculationsService } from 'src/app/services/calculations.service';

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

  // Location autofill
  locations: Location[] = [];
  filteredLocations: Location[] = [];
  isOpenPopLocation = false;
  selectedLocation!: Location;
  userLocation = "";

  constructor(private shiftService: ShiftsService, private locationService: LocationsService, private calcs: CalculationsService, private route: ActivatedRoute) {
    this.currentYear = new Date().getFullYear();
    this.currentMonth = new Date().getMonth();
    this.setCurrentMonthPeriod()
  }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.getShiftsForPeriod();
      this.getAllLocations();
    })
  }

  // GET DATA
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

  // CALC
  setCurrentMonthPeriod() {
    this.startPeriod = new Date(this.currentYear, this.currentMonth, 1, 5);
    this.endPeriod = new Date(this.currentYear, this.currentMonth + 1, 0, 3);

    this.beginDatetime = this.startPeriod.toISOString();
    this.endDatetime = this.endPeriod.toISOString();
    this.getShiftsForPeriod();
  }

  // BUTTON HANDLERS
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
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.setCurrentMonthPeriod();
  }

  // SAVE BUTTONS HANDLERS
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

  // LOCATION DROPDOWN FILTER
  async getAllLocations() {
    this.locationService.getAllLocations().then(locs => {
      this.locations = locs.map(loc =>
        new Location(loc.name, loc.town, loc.address, loc.totalWorkedShifts, loc.totalEarned, loc.averageRating, loc.id)
      );
    })
  }

  calculateShiftsByLocation(locationId: string) {
    this.shiftService.getShiftsByLocation(locationId).then((res) => {
      this.getEarliestAndLatestDates(res);
      let stats = this.getShiftStats(res);
      this.countShifts = stats.shiftCount;
      this.countHours = `${(stats.totalHours / 60).toFixed(2)} uren`;
      this.earnings = `€ ${stats.totalEarnings.toFixed(2)}`;
      this.earningsPlusNA = `€ ${stats.totalEarningsNA.toFixed(2)}`;
    })
  }

  getEarliestAndLatestDates(shifts: Shift[]) {
    const dates = shifts.reduce(
      (acc, shift) => {
        // Compare shift.startPeriod for the earliest date
        if (shift.startdate < acc.earliest) {
          acc.earliest = shift.startdate;
        }
        // Compare shift.endPeriod for the latest date
        if (shift.enddate > acc.latest) {
          acc.latest = shift.enddate;
        }
        return acc;
      },
      {
        earliest: shifts[0].startdate, // Start with the first element's startPeriod
        latest: shifts[0].enddate       // Start with the first element's endPeriod
      }
    );

    // Set this.startPeriod and this.endPeriod with the results
    this.startPeriod = dates.earliest.toDate();
    this.endPeriod = dates.latest.toDate();
  }

  presentPopLocation() {
    this.isOpenPopLocation = !this.isOpenPopLocation;
  }

  locationSelected(item: Location) {
    this.selectedLocation = item;
    this.userLocation = this.selectedLocation.toString();
    this.isOpenPopLocation = false;
    if (item && item.id) {
      this.calculateShiftsByLocation(item.id)
    }
  }

  filterLocations(value: string) {
    this.isOpenPopLocation = true;
    if (value && value.trim() !== '') {
      const query = value.toLowerCase();
      this.filteredLocations = this.locations.filter(loc => {
        return loc.toString().toLowerCase().includes(query)
      });
    } else {
      this.filteredLocations = [];
    }
  }

  onStatsLocationChange() {
    if (this.selectedLocation && this.selectedLocation.toString().toLowerCase() === this.userLocation.toLowerCase()) {
      this.isOpenPopLocation = false;
    } else {
      this.filterLocations(this.userLocation);
    }
  }

  removeInputLocation() {
    this.userLocation = "";
    this.filterLocations(this.userLocation);
    this.isOpenPopLocation = false;
    this.setCurrentMonthPeriod();
  }
}
