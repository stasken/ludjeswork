import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocationsService } from 'src/app/services/locations.service';
import { ShiftsService } from 'src/app/services/shifts.service';
import { Shift } from 'src/models/shift';
import { Location } from 'src/models/location';

export class ShiftItem {
  id: string;
  location: Location;
  title: string;
  comment: string;
  platform: string;
  accepted: boolean;
  break: number;
  earnings: number;
  rating: number;
  enddate: Date;
  startdate: Date;
  completed: boolean;

  constructor(id: string, location: Location, platform: string, comment: string, accepted: boolean, breakMinutes: number, earnings: number, rating: number,
    enddate: Date, startdate: Date, today: Date
  ) {
    this.id = id;
    this.location = location;
    this.platform = platform;
    this.comment = comment;
    this.title = `\u2606 ${rating}`;
    this.accepted = accepted;
    this.break = breakMinutes;
    this.earnings = earnings;
    this.rating = rating;
    this.enddate = enddate;
    this.startdate = startdate;
    this.completed = this.startdate < today;
  }

}

@Component({
  selector: 'app-shift-list',
  templateUrl: './shift-list.component.html',
  styleUrls: ['./shift-list.component.scss'],
})
export class ShiftListComponent implements OnInit {
  currentSelectedShifts: ShiftItem[] = [];
  currentFilteredShifts: ShiftItem[] = [];
  shiftMap!: Map<string, ShiftItem>;

  paramsSub!: Subscription;

  // filter
  today: Date;
  startPeriod: Date;
  endPeriod: Date;

  beginDatetime: string;
  endDatetime: string;

  showBeginDatePicker = false;
  showEndDatePicker = false;

  onlyPending = false;

  // Location autofill
  locations: Location[] = [];
  filteredLocations: Location[] = [];
  isOpenPopLocation = false;
  selectedLocation!: Location;
  userLocation = "";

  constructor(private shiftService: ShiftsService, private locationService: LocationsService, private route: ActivatedRoute) {
    this.today = new Date();
    this.startPeriod = this.today;
    this.endPeriod = new Date(this.today.getFullYear(), this.today.getMonth() + 2, 0, 3); //  last day of current month

    this.beginDatetime = this.startPeriod.toISOString();
    this.endDatetime = this.endPeriod.toISOString();
  }

  async ngOnInit() {
    await this.getAllLocations();
    this.getAllFutureShifts()
    this.paramsSub = this.route.params.subscribe(params => {
      this.getUnratedCompletedShifts();
      this.filterLocations("");
      this.getAllFutureShifts()
    })
  }

  async getAllLocations() {
    this.locationService.getAllLocations().then(locs => {
      this.locations = locs.map(loc =>
        new Location(loc.name, loc.town, loc.address, loc.totalWorkedShifts, loc.totalEarned, loc.averageRating, loc.id)
      );
    })
  }
  async getAllFutureShifts() {
    this.shiftService.getAllFutureShifts().then((res) => {
      this.setCurrentShifts(res);
    })
  }

  async getAllShifts() {
    this.shiftService.getAllShifts().then((res) => {
      this.setCurrentShifts(res);
    })
  }

  getUnratedCompletedShifts() {
    this.shiftService.getUnratedCompletedShifts().then(res => {
      if (res.length > 0) {
        window.alert("Gelieve eerst de afgewerkte shiften een rating te geven.");
        this.setCurrentShifts(res);
      } else {
        this.getShiftsByPeriod();
      }
    })
  }
  getShiftsByPeriod() {
    this.shiftService.getShiftsByPeriod(this.startPeriod, this.endPeriod).then((res) => {
      this.setCurrentShifts(res);
    })
  }

  getShiftsByLocation(locationId: string) {
    this.shiftService.getShiftsByLocation(locationId).then((res) => {
      this.setCurrentShifts(res);
    })
  }

  setCurrentShifts(shifts: Shift[]) {
    this.currentSelectedShifts = [];
    shifts.forEach((shift) => {
      let location = this.locations.find(loc => loc.id === shift.locationId);
      if (location) {
        let shiftItem: ShiftItem = new ShiftItem(shift.id ?? "", location, shift.platform, shift.comment, shift.accepted, shift.break, shift.earnings, shift.rating, shift.enddate.toDate(), shift.startdate.toDate(), this.today);
        this.currentSelectedShifts.push(shiftItem);
      }
    })
    this.shiftMap = new Map(this.currentSelectedShifts.map(item => [item.id, item]));
    this.currentFilteredShifts = this.currentSelectedShifts.slice(0);
  }

  updateShift(shift: ShiftItem) {
    const index = this.currentSelectedShifts.indexOf(shift, 0);
    if (index > - 1) {
      shift.title = `\u2606 ${shift.rating}`;
      this.currentSelectedShifts[index] = shift;
      this.currentFilteredShifts = this.currentSelectedShifts.slice(0);
    }
  }

  refresh() {
    this.getAllFutureShifts();
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
      this.currentFilteredShifts = this.currentSelectedShifts.slice(0);
    } else {
      this.currentFilteredShifts = this.currentSelectedShifts.filter(shift => {
        return shift.accepted !== this.onlyPending;
      });
    }
  }

  filterOrderChanged(e: any) {
    switch (e.detail.value) {
      case 'ratingLowHigh':
        var filtered = this.currentSelectedShifts.filter(shift => shift.rating !== 0);
        if (filtered.length === 0) {
          window.alert("De lijst bevat enkel toekomstige shifts, dus nog zonder rating.");
          e.target.value = null;
          break;
        }
        this.currentFilteredShifts = filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'ratingHighLow':
        var filtered = this.currentSelectedShifts.filter(shift => shift.rating !== 0);
        if (filtered.length === 0) {
          e.target.value = null;
          window.alert("De lijst bevat enkel toekomstige shifts, dus nog zonder rating.");
          break;
        }
        this.currentFilteredShifts = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'ratingLowHighAll':
        this.getAllShifts();
        this.currentFilteredShifts = this.currentSelectedShifts.sort((a, b) => a.rating - b.rating);
        break;
      case 'ratingHighLowAll':
        this.getAllShifts();
        this.currentFilteredShifts = this.currentSelectedShifts.sort((a, b) => b.rating - a.rating);
        break;
      case 'earningsHighLow':
        this.currentFilteredShifts = this.currentSelectedShifts.sort((a, b) => b.earnings - a.earnings);
        break;
      case 'earningsLowHigh':
        this.currentFilteredShifts = this.currentSelectedShifts.sort((a, b) => a.earnings - b.earnings);
        break;
      case 'descendingByDate':
        this.currentFilteredShifts = this.currentSelectedShifts.sort((a, b) => a.startdate.getTime() - b.startdate.getTime());
        break;
      case 'ascendingByDate':
        this.currentFilteredShifts = this.currentSelectedShifts.sort((a, b) => b.startdate.getTime() - a.startdate.getTime());
        break;

      default:
    }
  }

  presentPopLocation() {
    this.isOpenPopLocation = !this.isOpenPopLocation;
  }

  locationSelected(item: Location) {
    this.selectedLocation = item;
    this.userLocation = this.selectedLocation.toString();
    this.isOpenPopLocation = false;
    if (item && item.id) {
      this.getShiftsByLocation(item.id)
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

  onLocationChange() {
    if (this.selectedLocation && this.selectedLocation.toString().toLowerCase() === this.userLocation.toLowerCase()) {
      this.isOpenPopLocation = false;
    } else {
      this.filterLocations(this.userLocation);
    }
  }
}


