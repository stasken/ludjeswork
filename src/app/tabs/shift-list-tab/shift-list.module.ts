import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShiftListPage } from './shift-list.page';

import { ShiftListPageRoutingModule } from './shift-list-routing.module';
import { ShiftListComponent } from '../../components/shifts/shift-list/shift-list.component';
import { ShiftItemComponent } from '../../components/shifts/shift-item/shift-item.component';
import { AddShiftComponent } from '../../components/shifts/add-shift/add-shift.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ShiftListPageRoutingModule
  ],
  declarations: [ShiftListPage,ShiftListComponent,ShiftItemComponent,AddShiftComponent]
})
export class ShiftListPageModule {}
