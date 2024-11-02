import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'documenten',
        loadChildren: () => import('../documents-tab/documents.module').then(m => m.DocumentPageModule)
      },
      {
        path: 'shiften',
        loadChildren: () => import('../shift-list-tab/shift-list.module').then(m => m.ShiftListPageModule)
      },
      {
        path: 'statistieken',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/shiften/toevoegen',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/shiften/toevoegen',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
