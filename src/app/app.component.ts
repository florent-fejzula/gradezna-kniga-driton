import { AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
export class AppComponent implements AfterViewInit {
  @ViewChildren('textareaElement') textareaElements!: QueryList<ElementRef>;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  fileName: string = '';

  gradbaBroj: string = '';
  gradezhnaKnigaInput: string = '';
  izveduvacInputValue: string = '';
  tableTitleInputValue: string = '';
  gradbaInputValue: string = '';
  knigaInputValue: string = '';
  datumInputValue: string = '';
  investorInputValue: string = '';
  adresaInputValue: string = '';
  pozicijaInputValue: string = '';
  merkaInputValue: string = '';
  preVkupnoInputValue: string = '';
  cenaInputValue: number | undefined;
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

  div4InputValue: string = '';
  isDiv4InputDisabled: boolean = true;

  constructor(private exportService: ExportService, public dialog: MatDialog) {}

  ngAfterViewInit() {
    this.syncTextareaHeight();
  }

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

  async importFile() {
    // @ts-ignore: electron is exposed in preload script
    const result = await window.electron.showOpenDialog();
    if (!result.canceled && result.filePath) {
      const filePath = result.filePath;
      this.fileName = this.extractFileName(filePath);
      // You can also load and process the file content here if needed
    }
  }

  extractFileName(filePath: string): string {
    return filePath.split('\\').pop()?.split('/').pop() ?? 'unknown';
  }

  exportToJson(): void {
    const dataToExport = {
      gradbaBroj: this.gradbaBroj,
      gradbaInputValue: this.gradbaInputValue,
      knigaInputValue: this.knigaInputValue,
      datumInputValue: this.datumInputValue,
      merkaInputValue: this.merkaInputValue,
      cenaInputValue: this.cenaInputValue,
      investorInputValue: this.investorInputValue,
      adresaInputValue: this.adresaInputValue,
      pozicijaInputValue: this.pozicijaInputValue,
      gradezhnaKnigaInput: this.gradezhnaKnigaInput,
      izveduvacInputValue: this.izveduvacInputValue,
      tableTitleInputValue: this.tableTitleInputValue,
      tableData: this.tableData,
      div4InputValue: this.div4InputValue,
      preVkupnoInputValue: this.preVkupnoInputValue,
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

  importJson(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name; // Set the file name to display

      const reader = new FileReader();
      reader.onload = (e) => {
        const importedData = JSON.parse(reader.result as string);

        this.gradbaBroj = importedData.gradbaBroj;
        this.gradbaInputValue = importedData.gradbaInputValue;
        this.knigaInputValue = importedData.knigaInputValue;
        this.datumInputValue = importedData.datumInputValue;
        this.merkaInputValue = importedData.merkaInputValue;
        this.cenaInputValue = importedData.cenaInputValue;
        this.investorInputValue = importedData.investorInputValue;
        this.adresaInputValue = importedData.adresaInputValue;
        this.pozicijaInputValue = importedData.pozicijaInputValue;
        this.gradezhnaKnigaInput = importedData.gradezhnaKnigaInput;
        this.izveduvacInputValue = importedData.izveduvacInputValue;
        this.tableTitleInputValue = importedData.tableTitleInputValue;
        this.tableData = importedData.tableData;
        this.div4InputValue = importedData.div4InputValue;
        this.preVkupnoInputValue = importedData.preVkupnoInputValue;
      };

      reader.readAsText(file);
    }
  }

  handleKeydown(event: KeyboardEvent, rowIndex: number, columnName: string): void {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default Enter key behavior

      // Update all textareas in the same row with a new line
      this.tableData.forEach((row, index) => {
        if (index === rowIndex) {
          row.redenBrojArea += '\n';
          row.textAreaInput += '\n';
          row.kolicinaArea += '\n';
          row.cenaArea += '\n';
          row.vkupnoArea += '\n';
        }
      });

      // Update the view
      this.syncTextareaHeight();
    }
  }

  syncTextareaHeight(): void {
    setTimeout(() => {
      const heights = this.textareaElements.map(element => element.nativeElement.scrollHeight);
      const maxHeight = Math.max(...heights);

      this.textareaElements.forEach(element => {
        element.nativeElement.style.height = `${maxHeight}px`;
      });
    });
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
    // this.calculateDiv4InputValue();
  }

  // calculateVkupnoArea(row: TableRow) {
  //   const kolicina = parseFloat(row.kolicinaArea);
  //   const cena = parseFloat(row.cenaArea);
  //   if (!isNaN(kolicina) && !isNaN(cena)) {
  //     row.vkupnoArea = (kolicina * cena).toFixed(2);
  //   } else {
  //     row.vkupnoArea = '';
  //   }
  //   // this.calculateDiv4InputValue();
  // }

  // calculateDiv4InputValue() {
  //   const total = this.tableData.reduce((total, row) => {
  //     return total + (parseFloat(row.vkupnoArea) || 0);
  //   }, 0);

  //   const formattedTotal = total.toFixed(2) + '.00';

  //   this.div4InputValue = parseFloat(formattedTotal);
  // }

  removeRow(index: number) {
    this.tableData.splice(index, 1);
  }

  printThisPage() {
    window.print();
  }
}
