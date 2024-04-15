import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    standalone: true,
    imports: [CommonModule,]
})
export class LoaderComponent {
    @Input() type: 'loader' | 'dots' = 'dots';
}
