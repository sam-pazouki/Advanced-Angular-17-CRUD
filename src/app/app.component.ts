import { Component } from '@angular/core';
import { MasterService } from './service/master.service';
import { ProductModel } from './model/product.model';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class AppComponent {
  // Define component properties
  productlist!: ProductModel[]; 
  datasource: any;
  editdata!: ProductModel;
  displayedColums: string[] = ['id', 'name', 'description', 'price', 'action']; 

  isadd = false;
  isedit = false;

  constructor(private service: MasterService, private builder: FormBuilder) {
    // Initialize component by loading product list
    this.loadproductlist();
  }
  title = 'Testapp1'; 

  // Load product list from service
  loadproductlist() {
    this.service.getallproducts().subscribe(items => { 
      this.productlist = items;
      this.datasource = new MatTableDataSource(this.productlist); 
    });
  }

  // Initialize product form using FormBuilder
  productform = this.builder.group({
    id: this.builder.control({ value: 0, disabled: true }),
    name: this.builder.control('', Validators.required),
    description: this.builder.control(''),
    price: this.builder.control(0)
  });

  // Save or update product based on form validation
  Saveproduct() {
    if (this.productform.valid) {
      const _obj: ProductModel = {
        id: this.productform.value.id as number,
        name: this.productform.value.name as string,
        description: this.productform.value.description as string,
        price: this.productform.value.price as number
      };
      if (this.isadd) {
        this.service.Createproduct(_obj).subscribe(item => {
          this.loadproductlist();
          this.isadd = false;
          this.isedit = false;
          alert('Criado com sucesso.'); 
        });
      } else {
        _obj.id = this.productform.getRawValue().id as number;
        this.service.Updateproduct(_obj).subscribe(item => {
          this.loadproductlist();
          this.isadd = false;
          this.isedit = false;
          alert('Atualizado com sucesso.'); 
        });
      }
    }
  }

  // Edit items by retrieving data from service
  editproduct(id: number) {
    this.service.Getproduct(id).subscribe(item => {
      this.editdata = item;
      this.productform.setValue({ id: this.editdata.id, name: this.editdata.name, description: this.editdata.description, price: this.editdata.price });
      this.isedit = true;
    });
  }

  // Remove items with confirmation dialog
  removeproduct(id: number) {
    if (confirm('Confirme para remover?')) {
      this.service.Deleteproduct(id).subscribe(item => {
        this.loadproductlist();
      });
    }
  }

  // Reset form and set 'isadd' to true to display add form
  addproduct() {
    this.productform.reset();
    this.isadd = true;
    this.isedit = false;
  }

  // Reset flags to hide add/edit form
  backtolist() {
    this.isadd = false;
    this.isedit = false;
  }
}
