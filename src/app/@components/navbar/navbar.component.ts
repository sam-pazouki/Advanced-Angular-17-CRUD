import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.prod';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    imports: [CommonModule, RouterModule],
    standalone: true,
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    appName = environment.name;

    constructor() {}

    ngOnInit(): void {
        
    }
}
