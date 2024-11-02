import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentsPage } from './documents.page';

import { DocumentsPageRoutingModule } from './documents-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DocumentsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [DocumentsPage],
})
export class DocumentPageModule {}
