import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { KavsirSharedModule } from '../../shared';
import {
    ResourceImageService,
    ResourceImagePopupService,
    ResourceImageComponent,
    ResourceImageDetailComponent,
    ResourceImageDialogComponent,
    ResourceImagePopupComponent,
    ResourceImageDeletePopupComponent,
    ResourceImageDeleteDialogComponent,
    resourceImageRoute,
    resourceImagePopupRoute,
} from './';

const ENTITY_STATES = [
    ...resourceImageRoute,
    ...resourceImagePopupRoute,
];

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        ResourceImageComponent,
        ResourceImageDetailComponent,
        ResourceImageDialogComponent,
        ResourceImageDeleteDialogComponent,
        ResourceImagePopupComponent,
        ResourceImageDeletePopupComponent,
    ],
    entryComponents: [
        ResourceImageComponent,
        ResourceImageDialogComponent,
        ResourceImagePopupComponent,
        ResourceImageDeleteDialogComponent,
        ResourceImageDeletePopupComponent,
    ],
    providers: [
        ResourceImageService,
        ResourceImagePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirResourceImageModule {}
