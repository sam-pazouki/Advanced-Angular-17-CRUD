import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class LoadingAPIService {
    onActiveChanges: BehaviorSubject<boolean>;
    constructor() {
        this.onActiveChanges = new BehaviorSubject(false);
    }

    show(): void {
        if (document?.getElementById("loading-api")?.style) {
            document.getElementById("loading-api")!.style.display = 'block';
        }
    }

    hide(): void {
        setTimeout(() => {
            if (document?.getElementById("loading-api")?.style) {
                document.getElementById("loading-api")!.style.display = 'none';
            }
        }, 1000);
    }
}
