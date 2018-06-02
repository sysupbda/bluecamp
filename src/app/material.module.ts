import { NgModule } from '@angular/core';

import {
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatGridListModule, MatToolbarModule, MatSlideToggleModule
} from '@angular/material';

@NgModule({
    imports: [
        MatSlideToggleModule,
        MatGridListModule,
        MatToolbarModule,
        MatButtonModule,
        MatSliderModule,
        MatMenuModule,
        MatIconModule,
        MatCardModule
    ],
    exports: [
        MatSlideToggleModule,
        MatGridListModule,
        MatToolbarModule,
        MatButtonModule,
        MatSliderModule,
        MatMenuModule,
        MatIconModule,
        MatCardModule
    ]
})
export class MaterialModule {}
