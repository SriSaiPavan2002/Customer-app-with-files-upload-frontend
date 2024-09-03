import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent {
  @Input() customer: any;
  @Input() isEditMode: boolean = false;
  @Output() customerAdded = new EventEmitter<any>();
  @Output() formCancelled = new EventEmitter<void>();

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.customerAdded.emit(this.customer);
      this.resetForm();
    }
  }

  onCancel() {
    this.resetForm();
    this.formCancelled.emit();
  }

  resetForm() {
    this.customer = {
      first_name: '',
      last_name: '',
      gender: '',
      email: '',
      address: '',
      city: '',
      state: ''
    };
  }
}
