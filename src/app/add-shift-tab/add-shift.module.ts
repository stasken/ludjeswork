import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddShiftPage } from './add-shift.page';

import { AddShiftPageRoutingModule } from './add-shift-routing.module';
import { AddShiftComponent } from '../shifts/add-shift/add-shift.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AddShiftPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddShiftPage,AddShiftComponent],
})
export class AddShiftPageModule {}
