import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { CustomerService } from './customer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showForm = false;
  searchTerm = '';
  sortOrder = 'asc'; 
  customers: any[] = []; 
  isEditMode = false;
  editingCustomer: any = null;

  constructor(private customerService: CustomerService) {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe(
      (data: any[]) => this.customers = data,
      (error: any) => console.error('Error loading customers', error)
    );
  }

  toggleForm(customer?: any) {
    this.showForm = !this.showForm;
    if (customer) {
      this.isEditMode = true;
      this.editingCustomer = { ...customer };
    } else {
      this.isEditMode = false;
      this.editingCustomer = {
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

  handleCustomerAdded(customer: any) {
    console.log('Form Data Submitted:', customer);
    const formattedCustomer = {
      first_name: customer.first_name, 
      last_name: customer.last_name,
      gender: customer.gender,
      email: customer.email,
      address: customer.address,
      city: customer.city,
      state: customer.state
    };

    if (this.isEditMode) {
      this.updateCustomer(this.editingCustomer.id, formattedCustomer);
    } else {
      this.createCustomer(formattedCustomer);
    }
  }

  createCustomer(customer: any) {
    console.log('Creating Customer:', customer);
    this.customerService.createCustomer(customer).subscribe(
      () => {
        console.log('Customer created successfully');
        this.loadCustomers();
        this.toggleForm();
      },
      (error: any) => {
        console.error('Error creating customer', error.error);
      }
    );
  }

  updateCustomer(id: number, customer: any) {
    this.customerService.updateCustomer(id, customer).subscribe(
      () => {
        this.loadCustomers();
        this.toggleForm();
      },
      (error: any) => console.error('Error updating customer', error)
    );
  }

  handleEditCustomer(customer: any) {
    this.toggleForm(customer);
  }

  handleDeleteCustomer(customer: any) {
    this.customerService.deleteCustomer(customer.id).subscribe(
      () => this.loadCustomers(),
      (error: any) => console.error('Error deleting customer', error)
    );
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data: any[] = XLSX.utils.sheet_to_json(worksheet);

        const validCustomers = data.map((item: any) => ({
          first_name: item['First Name'] || '',
          last_name: item['Last Name'] || '',
          gender: item['Gender'] || '',
          email: item['Email'] || '',
          address: item['Address'] || '',
          city: item['City'] || '',
          state: item['State'] || ''
        }));

        this.customerService.importCustomers(validCustomers).subscribe(
          () => this.loadCustomers(),
          (error: any) => console.error('Error importing customers', error)
        );
      };
      reader.readAsBinaryString(file);
    }
  }

  onSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.sortBy(selectElement.value);
  }

  sortBy(order: string) {
    this.sortOrder = order;
  }

  get filteredCustomers() {
    const filtered = this.customers.filter(customer =>
      `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const nameA = `${a.first_name} ${a.last_name}`;
      const nameB = `${b.first_name} ${b.last_name}`;
      if (nameA < nameB) return this.sortOrder === 'asc' ? -1 : 1;
      if (nameA > nameB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }
}
