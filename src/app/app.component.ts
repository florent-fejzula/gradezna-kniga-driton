import { Component } from '@angular/core';
import { ExportService } from './export.service';
import { FileSaveDialogComponent } from './file-save-dialog/file-save-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  gradbaInputValue: string = '';
  // izveduvacInputValue: string = '';
  knigaInputValue: string = '';
  datumInputValue: string = '';
  investorInputValue: string = '';
  adresaInputValue: string = '';
  pozicijaInputValue: string = '';
  merkaInputValue: string = '';
  cenaInputValue: number | undefined;
  redenBrojArea: string = '';
  textAreaInput: string = '';
  kolicinaArea: string = '';
  merkaArea: string = '';
  cenaArea: string = '';
  vkupnoArea: string = '';
  div2InputValue: string = '';
  div3InputValue: string = '';
  div4InputValue: string = '';
  exportFileName: string = 'exported-data.json'; // Default file name

  fontSize: number = 20;

  constructor(private exportService: ExportService, public dialog: MatDialog) {}

  increaseFontSize() {
    this.fontSize += 1;
  }

  decreaseFontSize() {
    this.fontSize = Math.max(10, this.fontSize - 1);
  }

  exportToJson(): void {
    const dataToExport = {
      gradbaInputValue: this.gradbaInputValue,
      knigaInputValue: this.knigaInputValue,
      datumInputValue: this.datumInputValue,
      investorInputValue: this.investorInputValue,
      adresaInputValue: this.adresaInputValue,
      pozicijaInputValue: this.pozicijaInputValue,
      redenBrojArea: this.redenBrojArea,
      textAreaInput: this.textAreaInput,
      kolicinaArea: this.kolicinaArea,
      merkaArea: this.merkaArea,
      cenaArea: this.cenaArea,
      vkupnoArea: this.vkupnoArea,
    };

    const dialogRef = this.dialog.open(FileSaveDialogComponent, {
      width: '300px',
      data: { fileName: this.exportFileName },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.exportFileName = result;
        this.exportService.exportToJsonFile(dataToExport, this.exportFileName);
      }
    });

    // Prompt the user for the file name
    // const userInput = prompt('Enter the file name:', this.exportFileName);
    // if (userInput !== null && userInput.trim() !== '') {
    //   this.exportFileName = userInput.trim();
    //   this.exportService.exportToJsonFile(dataToExport, this.exportFileName);
    // }
  }

  importJson(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const importedData = JSON.parse(reader.result as string);

        (this.gradbaInputValue = importedData.gradbaInputValue),
          (this.knigaInputValue = importedData.knigaInputValue),
          (this.datumInputValue = importedData.datumInputValue),
          (this.investorInputValue = importedData.investorInputValue),
          (this.adresaInputValue = importedData.adresaInputValue),
          (this.pozicijaInputValue = importedData.pozicijaInputValue),
          (this.redenBrojArea = importedData.redenBrojArea);
        this.textAreaInput = importedData.textAreaInput;
        this.kolicinaArea = importedData.kolicinaArea;
        this.merkaArea = importedData.merkaArea;
        this.cenaArea = importedData.cenaArea;
        this.vkupnoArea = importedData.vkupnoArea;
      };

      reader.readAsText(file);
    }
  }

  printThisPage() {
    window.print();
  }
}
