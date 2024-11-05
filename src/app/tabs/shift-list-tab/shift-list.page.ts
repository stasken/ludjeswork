import { Component, ViewChild } from '@angular/core';
import { ShiftListComponent } from '../../components/shifts/shift-list/shift-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shift-list-tab',
  templateUrl: 'shift-list.page.html',
  styleUrls: ['shift-list.page.scss']
})
export class ShiftListPage {
  @ViewChild(ShiftListComponent) shiftListComponent!: ShiftListComponent;
  allShifts = false;

  constructor(private router: Router) {}

  navigateToShiftToevoegen() {
    this.router.navigate(['shiften/toevoegen']);
  }
  onChangeShifts() {
    
  }
}
