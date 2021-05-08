import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './app/material-module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { TcTable } from './app/tc-table';
import { MatButtonModule } from '@angular/material/button';
import { EditDialog } from './app/edit-dlg';
import { MatDialogModule } from '@angular/material/dialog';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { InlineEditComponent } from './app/inline-edit';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SatPopoverModule,
    FormsModule,
    HttpClientModule,
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
  ],
  entryComponents: [TcTable, EditDialog],
  declarations: [TcTable, EditDialog, InlineEditComponent],
  bootstrap: [TcTable],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' }
    }
  ]
})
export class AppModule {}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));

