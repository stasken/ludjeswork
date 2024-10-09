import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { ShiftListComponent } from '../shifts/shift-list/shift-list.component';
import { ShiftItemComponent } from '../shifts/shift-item/shift-item.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule
  ],
  declarations: [Tab2Page,ShiftListComponent,ShiftItemComponent]
})
export class Tab2PageModule {}
