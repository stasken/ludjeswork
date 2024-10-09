import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { AddShiftComponent } from '../shifts/add-shift/add-shift.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [Tab1Page,AddShiftComponent],
})
export class Tab1PageModule {}
