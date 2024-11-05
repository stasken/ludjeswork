import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftListPage } from './shift-list.page';
import { AddShiftComponent } from '../../components/shifts/add-shift/add-shift.component';
// import { tabsGuard } from 'src/app/services/tabs.guard';

const routes: Routes = [
  {
    path: '',
    component: ShiftListPage,
    // canActivate: [tabsGuard]
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
