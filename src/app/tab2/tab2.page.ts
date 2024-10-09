import { Component, ViewChild } from '@angular/core';
import { ShiftListComponent } from '../shifts/shift-list/shift-list.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  @ViewChild(ShiftListComponent) shiftListComponent!: ShiftListComponent;

  callSaveMethod() {
    this.shiftListComponent.saveAll();
  }
  constructor() {}
}
