import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
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
  @ViewChildren('editableDiv') editableDivs!: QueryList<ElementRef>;
  @ViewChildren('textareaElement') textareaElements!: QueryList<ElementRef>;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.adjustTableBodyHeight();
  }

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

  fontSize: number = 20;
  fontSizePozicija: number = 20;
  div4InputValue: string = '';
  isDiv4InputDisabled: boolean = true;

  tableData: TableRow[] = [
    {
      redenBrojArea: '',
      textAreaInput: '',
      kolicinaArea: '',
      merkaArea: '',
      cenaArea: '',
      vkupnoArea: '',
    },
  ];

  constructor(
    private exportService: ExportService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.adjustTableBodyHeight();
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

  underlineText(): void {
    document.execCommand('underline');
    this.applyCustomUnderline();
  }

  applyCustomUnderline(): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const elements =
        range.commonAncestorContainer.parentElement?.querySelectorAll('u');
      elements?.forEach((element: HTMLElement) => {
        element.style.textDecoration = 'none'; // Remove default underline
        element.style.borderBottom = '2px solid currentColor'; // Add custom underline
        element.style.paddingBottom = '20px'; // Adjust padding to move underline down
      });
    }
  }

  insertHorizontalLine() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const commonAncestor = range.commonAncestorContainer;

      let editableDiv: Element | null = null;
      if (commonAncestor.nodeType === Node.ELEMENT_NODE) {
        editableDiv = (commonAncestor as Element).closest('.editableDiv');
      } else if (commonAncestor.parentElement) {
        editableDiv = commonAncestor.parentElement.closest('.editableDiv');
      }

      if (editableDiv) {
        const hr = document.createElement('hr');
        hr.style.marginBlockStart = '1px';
        hr.style.marginBlockEnd = '1px';
        hr.style.borderColor = 'black';
        range.deleteContents();
        range.insertNode(hr);
      }
    }
  }

  // underlineText(): void {
  //   document.execCommand('underline', false, '');
  // }

  adjustTableBodyHeight() {
    const wrapper = document.querySelector('.wrapper') as HTMLElement;
    const topPart = document.querySelector('.top_part') as HTMLElement;
    const bottomPart = document.querySelector('.bottom_part') as HTMLElement;
    const tbody = document.querySelector('.mainTable tbody') as HTMLElement;

    if (wrapper && topPart && bottomPart && tbody) {
      const availableHeight =
        wrapper.clientHeight - topPart.clientHeight - bottomPart.clientHeight;
      tbody.style.maxHeight = `${availableHeight}px`;
    }
  }

  boldText() {
    document.execCommand('bold');
  }

  changeFontColor(color: string): void {
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand('foreColor', false, color);
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
      tableData: this.tableData.map((row) => ({ ...row })),
      div4InputValue: this.div4InputValue,
      preVkupnoInputValue: this.preVkupnoInputValue,
      fontSize: this.fontSize,
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
  }

  importJson(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;

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
        this.fontSize = importedData.fontSize || 16;
        this.cdr.detectChanges();
      };

      reader.readAsText(file);
    }
    this.cdr.detectChanges();
  }

  saveAsPDF() {
    if ((window as any).electron && (window as any).electron.saveAsPDF) {
      (window as any).electron
        .saveAsPDF({})
        .then((result: any) => {
          if (result.success) {
            console.log('PDF saved to:', result.path);
          } else {
            console.error('Failed to save PDF:', result.error);
          }
        })
        .catch((error: any) => {
          console.error('Error during save as PDF:', error);
        });
    } else {
      console.error('saveAsPDF function is not available');
    }
  }

  // printPage() {
  //   if ((window as any).electron && (window as any).electron.printPage) {
  //     (window as any).electron
  //       .printPage()
  //       .then((result: any) => {
  //         if (result.success) {
  //           console.log('Print job started');
  //         } else {
  //           console.error('Failed to start print job:', result.error);
  //         }
  //       })
  //       .catch((error: any) => {
  //         console.error('Error during print:', error);
  //       });
  //   } else {
  //     console.error('printPage function is not available');
  //   }
  // }

  printPage() {
    window.print();
  }
}
