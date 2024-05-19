import { Component } from '@angular/core';
import { ExportService } from './export.service';
import { FileSaveDialogComponent } from './file-save-dialog/file-save-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface TableRow {
  redenBrojArea: string;
  textAreaInput: string;
  kolicinaArea: string;
  merkaArea: string;
  cenaArea: string;
  vkupnoArea: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  gradbaBroj: string = '';
  gradbaInputValue: string = '';
  knigaInputValue: string = '';
  datumInputValue: string = '';
  investorInputValue: string = '';
  adresaInputValue: string = '';
  pozicijaInputValue: string = '';
  merkaInputValue: string = '';
  cenaInputValue: number | undefined;
  // redenBrojArea: string = '';
  // textAreaInput: string = '';
  // kolicinaArea: string = '';
  // merkaArea: string = '';
  // cenaArea: string = '';
  // vkupnoArea: string = '';
  exportFileName: string = 'exported-data.json'; // Default file name

  fontSize: number = 16;
  fontSizePozicija: number = 20;

  tableData: TableRow[] = [
    {
      redenBrojArea: '1',
      textAreaInput: '',
      kolicinaArea: '',
      merkaArea: '',
      cenaArea: '',
      vkupnoArea: '',
    },
  ];

  div4InputValue: number = 0;
  isDiv4InputDisabled: boolean = true;

  constructor(private exportService: ExportService, public dialog: MatDialog) {}

  increaseFontSize() {
    this.fontSize += 1;
  }

  decreaseFontSize() {
    this.fontSize = Math.max(10, this.fontSize - 1);
  }

  increasePozicijaFontSize() {
    this.fontSizePozicija += 1;
  }

  decreasePozicijaFontSize() {
    this.fontSizePozicija = Math.max(10, this.fontSizePozicija - 1);
  }

  exportToJson(): void {
    const dataToExport = {
      gradbaBroj: this.gradbaBroj,
      gradbaInputValue: this.gradbaInputValue,
      knigaInputValue: this.knigaInputValue,
      datumInputValue: this.datumInputValue,
      investorInputValue: this.investorInputValue,
      adresaInputValue: this.adresaInputValue,
      pozicijaInputValue: this.pozicijaInputValue,
      tableData: this.tableData,
      div4InputValue: this.div4InputValue
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

        (this.gradbaBroj = importedData.gradbaBroj),
          (this.gradbaInputValue = importedData.gradbaInputValue),
          (this.knigaInputValue = importedData.knigaInputValue),
          (this.datumInputValue = importedData.datumInputValue),
          (this.investorInputValue = importedData.investorInputValue),
          (this.adresaInputValue = importedData.adresaInputValue),
          (this.pozicijaInputValue = importedData.pozicijaInputValue),
          (this.tableData = importedData.tableData),
          (this.div4InputValue = importedData.div4InputValue);
      };

      reader.readAsText(file);
    }
  }

  addNewRow() {
    const nextRedenBroj = this.tableData.length + 1;
    this.tableData.push({
      redenBrojArea: nextRedenBroj.toString(),
      textAreaInput: '',
      kolicinaArea: '',
      merkaArea: '',
      cenaArea: '',
      vkupnoArea: '',
    });
    this.calculateDiv4InputValue();
  }

  calculateVkupnoArea(row: TableRow) {
    const kolicina = parseFloat(row.kolicinaArea);
    const cena = parseFloat(row.cenaArea);
    if (!isNaN(kolicina) && !isNaN(cena)) {
      row.vkupnoArea = (kolicina * cena).toFixed(2);
    } else {
      row.vkupnoArea = '';
    }
    this.calculateDiv4InputValue();
  }

  calculateDiv4InputValue() {
    const total = this.tableData.reduce((total, row) => {
      return total + (parseFloat(row.vkupnoArea) || 0);
    }, 0);

    // Append .00 to the formatted total
    const formattedTotal = total.toFixed(2) + '.00';

    this.div4InputValue = parseFloat(formattedTotal);
  }

  removeRow(index: number) {
    this.tableData.splice(index, 1);
  }

  printThisPage() {
    window.print();
  }
}
