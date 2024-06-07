import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FileSaveDialogComponent } from './file-save-dialog/file-save-dialog.component';
import { ContenteditableValueAccessorDirective } from './contenteditable-value-accessor.directive';

@NgModule({
  declarations: [AppComponent, FileSaveDialogComponent, ContenteditableValueAccessorDirective],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatTableModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
