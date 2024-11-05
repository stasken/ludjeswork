import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftListPage } from './shift-list.page';
import { AddShiftComponent } from '../../components/shifts/add-shift/add-shift.component';

const routes: Routes = [
  {
    path: '',
    component: ShiftListPage,
  },
  {
    path: "toevoegen",
    component: AddShiftComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftListPageRoutingModule {}
