import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'documenten',
        loadChildren: () => import('./documents-tab/documents.module').then(m => m.DocumentPageModule)
      },
      {
        path: 'shiften',
        loadChildren: () => import('./shift-list-tab/shift-list.module').then(m => m.ShiftListPageModule)
      },
      {
        path: 'statistieken',
        loadChildren: () => import('./stats-tab/stats.module').then(m => m.StatsPageModule)
      },
    ]
  },
  {
    path: '',
    redirectTo: '/shiften/toevoegen',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/shiften/toevoegen',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
