

import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '@components/loader/loader.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '@modules/products/[data]';
import { CreateXslxDto, XcelHeaderCell, XcelService } from '@core/excel-export';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductsComponent } from '@modules/products/ui/products/products.component';
import { ProductModalComponent } from '../ui/product-modal/product-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    standalone: true,
    imports: [CommonModule, DatePipe, RouterModule, LoaderComponent, HttpClientModule, FormsModule, MatSnackBarModule, MatButtonModule, MatFormFieldModule, MatInputModule, ProductsComponent, ProductModalComponent],
    providers: [DatePipe],
    selector: 'app-product-page',
    templateUrl: './product-page.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrls: ['./product-page.component.scss', './product-page.responsive.scss']
})
export class ProductPageComponent implements OnInit {
    // @ViewChild('productModalComponent') productModalComponent!: ProductModalComponent;

    constructor(
      public dialog: MatDialog,
      private productService: ProductService,
      private toster: MatSnackBar,
      private excelService: XcelService<any>
    ) {}

    ngOnInit(): void {
      this.getProducts();
    }

    loadProducts() {
      this.getProducts();
    }

    loadingProduct = false;
    loadingScrollProduct = false;
    products: Product.Entity[] = [];
    filteredProducts: Product.Entity[] = [];

    selectedSort = 'id';
    selectedOrderBy = 'asc';

    skipProduct = 0;
    limitProduct = 20;

    totalProduct = 0;
    searchProduct = '';
    getProducts() {
      this.loadingProduct = true;
      this.productService.getProducts().subscribe(data => {
        try {
          console.log(data);
          if (data) {
            this.products = data || [];
            this.filteredProducts = Object.assign([], this.products);
            this.totalProduct = this.products?.length;
            this.onSearchProduct();
          } else {
            this.toster.open("Something when wrong!", '', { duration: 5000});
          }
        } catch (error) {
          this.toster.open("Something when wrong!", '', { duration: 5000});
        }
        setTimeout(() => {
          this.loadingProduct = false;
        }, 500);
      });
    }

    onScroll(event: any) {
        if (event?.srcElement?.scrollTop + event?.srcElement?.offsetHeight >= event?.srcElement?.scrollHeight - 50 && !this.loadingScrollProduct) {
           console.log("End", this.totalProduct, this.filteredProducts?.length);
           if (this.limitProduct < this.totalProduct) {
            this.loadingScrollProduct = true;
            setTimeout(() => {
                this.loadingScrollProduct = false;
                this.limitProduct += this.limitProduct;
            }, 1000);
           }
           return;
        }
        return;
    }

    onSearchProduct() {
      this.limitProduct = 20;
      const lowerCaseSearchText = this.searchProduct?.toLowerCase() || '';
      this.filteredProducts = this.products.filter((item) => {
          return (
              ("" + item.id)?.toLowerCase().includes(lowerCaseSearchText) ||
              item.name?.toLowerCase().includes(lowerCaseSearchText) ||
              item.description?.toLowerCase().includes(lowerCaseSearchText)
          );
      });
    }

    loadingExport = false;
    exportProduct() {
      this.loadingExport = true;
      
      const headers: XcelHeaderCell[] = [
        { data: 'Id', width: 40 },
        { data: 'Nome', width: 40 },
        { data: 'Descrição', width: 100 },
      ];

      const now = new Date().getTime();
      const worksheetName = "Products";
      const title = "Products" + "-" + now!;

      const data: Array<(string | number)[]> = this.products.map(
        (item: any, index: number) => {
          const datas: any = [
            item?.id,
            item?.name,
            item?.description,
          ];
          return datas;
        }
      );

      const excelDto: CreateXslxDto = {
          worksheetName,
          title,
          headers,
          data,
      };

      this.excelService.exportToExcel(excelDto, [6,7],
          () => {
            setTimeout(() => {
              this.loadingExport = false;
              this.toster.open('Success Export to Excel', '', { duration: 5000});
            }, 1000);
      });
    }

    changesSort(event: any) {
      if (event) {
        this.limitProduct = 20;
        this.onSearchProduct();
        if (event?.selectedSort === 'id') {
          this.filteredProducts = this.filteredProducts?.sort((a, b) => {
            if (event?.selectedOrderBy === 'asc') {
              return a.id - b.id;
            } 
            return b.id - a.id;
          })
        }

        if (event?.selectedSort === 'name') {
          this.filteredProducts = this.filteredProducts?.sort((a, b) => {
            const displayNameA = a.name!.toLowerCase();
            const displayNameB = b.name!.toLowerCase();
            if (event?.selectedOrderBy === 'asc') {
              return displayNameA.localeCompare(displayNameB);
            } 
            return displayNameB.localeCompare(displayNameA);
          })
        }
      }
    }

    addProduct() {
      const dialogRef = this.dialog.open(ProductModalComponent, {
        width: '60vw',
        data: {detail: false, product: { id: "" + (this.totalProduct + 1)}},
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadProducts();
        }
      });
    }
}
