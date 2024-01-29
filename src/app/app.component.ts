import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  gradbaInputValue: string = '';
  izveduvacInputValue: string = '';
  knigaInputValue: string = '';
  datumInputValue: string = '';
  investorInputValue: string = '';
  adresaInputValue: string = '';
  pozicijaInputValue: string = '';
  merkaInputValue: string = '';
  cenaInputValue: number | undefined;

  printThisPage() {
    window.print();
  }
  
}
