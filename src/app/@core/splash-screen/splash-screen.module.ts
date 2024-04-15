import { NgModule } from '@angular/core';
import { SplashScreenService } from './splash-screen.service';

@NgModule({
    providers: [SplashScreenService],
})
export class SplashScreenModule {
    constructor(private _splashScreenService: SplashScreenService) {}
}
