import { Component, ViewChild } from '@angular/core';
import { ShiftListComponent } from '../shifts/shift-list/shift-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  @ViewChild(ShiftListComponent) shiftListComponent!: ShiftListComponent;
  allShifts = false;

  constructor(private router: Router) {}

  navigateToShiftToevoegen() {
    this.router.navigate(['tabs/toevoegen']);
  }
  onChangeShifts() {
    
  }
}
