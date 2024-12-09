import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentsPage } from './documents.page';

import { DocumentsPageRoutingModule } from './documents-routing.module';
import { DocumentListComponent } from 'src/app/components/documents/document-list/document-list.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DocumentsPageRoutingModule,
    ReactiveFormsModule,
    AngularFireStorageModule
  ],
  declarations: [DocumentsPage, DocumentListComponent],
})
export class DocumentPageModule {}
