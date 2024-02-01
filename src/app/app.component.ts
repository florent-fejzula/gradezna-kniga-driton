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
  redenBrojArea: string = '';
  textAreaInput: string = '';
  kolicinaArea: string = '';
  merkaArea: string = '';
  cenaArea: string = '';
  vkupnoArea: string = '';
  div2InputValue: string = '';
  div3InputValue: string = '';
  div4InputValue: string = '';

  yourDataSource = [
    { quantity: 1, unit: 'm1', price: 10, total: 10 },
    { quantity: 2, unit: 'kom', price: 5, total: 10 },
    // Add more data as needed
  ];

  addRow() {

  }

  printThisPage() {
    window.print();
  }
  
}
