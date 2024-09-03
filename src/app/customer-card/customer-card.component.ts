import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-customer-card',
  templateUrl: './customer-card.component.html',
  styleUrls: ['./customer-card.component.css']
})
export class CustomerCardComponent {
  @Input() customer: any;
  @Output() editCustomer = new EventEmitter<any>();
  @Output() deleteCustomer = new EventEmitter<any>();

  get customerIcon() {
    return this.customer.gender === 'Male' ? 'assets/male-icon.png' : 'assets/female-icon.png';
  }

  onEdit() {
    this.editCustomer.emit(this.customer);
  }

  onDelete() {
    this.deleteCustomer.emit(this.customer);
  }
}
