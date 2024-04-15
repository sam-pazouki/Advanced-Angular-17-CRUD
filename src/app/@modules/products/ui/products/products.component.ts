import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '@components/loader/loader.component';
import { HttpClientModule } from '@angular/common/http';
import { Product, ProductService } from '@modules/products/[data]';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule, LoaderComponent, HttpClientModule, MatButtonModule, MatDialogModule, ProductModalComponent, MatSnackBarModule],
    providers: [],
    selector: 'app-products',
    templateUrl: './products.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrls: ['./products.component.scss', './products.responsive.scss']
})
export class ProductsComponent implements OnInit {
    @Input() loadingProduct = false;
    @Input() loadingScrollProduct = false;
    @Input() products: Product.Entity[] = [];
    @Input() selectedSort = 'id';
    @Input() selectedOrderBy = 'asc';
    
    @Output() changesSort = new EventEmitter<any>();
    @Output() updateData = new EventEmitter<any>();

    constructor(public dialog: MatDialog, private productService: ProductService, private toster: MatSnackBar) {}

    ngOnInit(): void {
    }

    openProductModal(item: Product.Entity, index: number) {
      const dialogRef = this.dialog.open(ProductModalComponent, {
        width: window.innerWidth <= 800 ? '80vw' : '60vw',
        data: {product: item, detail: true},
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.updateData.emit(result);
        }
      });
    }

    changeSort() {
      this.changesSort.emit({selectedSort: this.selectedSort, selectedOrderBy: this.selectedOrderBy})
    }

    deleteProduct(item: Product.Entity, index: number) {
      if (confirm('Confirme para remover?')) {
        this.productService.deleteProduct(item.id).subscribe(item => {
          this.updateData.emit(item);
          this.toster.open("Product Remove Successfully", '', { duration: 5000});
        });
      }
    }
}
