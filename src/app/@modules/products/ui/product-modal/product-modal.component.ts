import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '@components/loader/loader.component';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '@modules/products/[data]';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule, LoaderComponent, ReactiveFormsModule, HttpClientModule, MatDialogModule, MatSnackBarModule, MatButtonModule, MatInputModule, MatFormFieldModule, ImageCropperModule],
    providers: [],
    selector: 'app-product-modal',
    templateUrl: './product-modal.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrls: ['./product-modal.component.scss', './product-modal.responsive.scss']
})
export class ProductModalComponent implements OnInit {
    submitting = false;

    imageChangedEvent: any = '';
    croppedImage: any = '';
    
    productForm = this.fb.group({
      id: this.fb.control({ value: 0, disabled: false }),
      name: this.fb.control('', Validators.required),
      description: this.fb.control('', Validators.required),
      photo: this.fb.control('', Validators.required)
    });
    
    constructor(
      public dialogRef: MatDialogRef<ProductModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      private toster: MatSnackBar,
      private productService: ProductService,
      private sanitizer: DomSanitizer
    ) {
      if (data.detail) {
        this.productForm?.patchValue({
          id: data?.product?.id,
          name: data?.product?.name,
          description: data?.product?.description,
          photo: data?.product?.photo,
        })
        this.croppedImage = data?.product?.photo;
      } else {
        this.productForm?.patchValue({
          id: data?.product?.id,
        });
      }
    }

    ngOnInit(): void {
    }

    openModal() {
    }

    closeModal() {
      this.dialogRef.close();
    }

    scoring() {
      const value: any = this.productForm.value;

      if (!this.productForm.valid ) {
          this.productForm.markAllAsTouched();
          if (!this.croppedImage) {
            this.toster.open("Photo Required!", '', { duration: 5000});
            return;
          }
          return;
      }

      this.submitting = true;

      if (this.data?.detail) {
        console.log("value", value);
        this.productService.updateProduct(value).subscribe(data => {
            try {
              console.log(data);
              if (data) {
                this.toster.open("Product Updated Successfully", '', { duration: 5000});
                this.data.product = value;
                this.dialogRef.close(value);
              } else {
                this.toster.open("Something when wrong!", '', { duration: 5000});
              }
            } catch (error) {
              this.toster.open("Something when wrong!", '', { duration: 5000});
            }
            this.submitting = false;
        });
      } else {
        this.productService.createProduct(value).subscribe(data => {
            try {
              console.log(data);
              if (data) {
                this.toster.open("Product Added Successfully", '', { duration: 5000});
                this.data.product = value;
                this.dialogRef.close(value);
              } else {
                this.toster.open("Something when wrong!", '', { duration: 5000});
              }
            } catch (error) {
              this.toster.open("Something when wrong!", '', { duration: 5000});
            }
            this.submitting = false;
        });
      }
    }


    fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
      if (event && event?.base64) {
        this.croppedImage = event?.base64;
        console.log("this.croppedImage", this.croppedImage);
        this.productForm.patchValue({
          photo: this.croppedImage,
        })
      }
    }

    imageLoaded(image: LoadedImage) {
        // show cropper
    }
    isImageReady = false;
    cropperReady() {
        // cropper ready
        this.isImageReady = true;
    }
    loadImageFailed() {
        // show message
    }
}
