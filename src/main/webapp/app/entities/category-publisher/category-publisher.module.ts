import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { KavsirSharedModule } from '../../shared';

import {
    CategoryPublisherService,
    CategoryPublisherPopupService,
    CategoryPublisherComponent,
    CategoryPublisherDetailComponent,
    CategoryPublisherDialogComponent,
    CategoryPublisherPopupComponent,
    CategoryPublisherDeletePopupComponent,
    CategoryPublisherDeleteDialogComponent,
    categoryPublisherRoute,
    categoryPublisherPopupRoute,
} from './';

let ENTITY_STATES = [
    ...categoryPublisherRoute,
    ...categoryPublisherPopupRoute,
];

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        CategoryPublisherComponent,
        CategoryPublisherDetailComponent,
        CategoryPublisherDialogComponent,
        CategoryPublisherDeleteDialogComponent,
        CategoryPublisherPopupComponent,
        CategoryPublisherDeletePopupComponent,
    ],
    entryComponents: [
        CategoryPublisherComponent,
        CategoryPublisherDialogComponent,
        CategoryPublisherPopupComponent,
        CategoryPublisherDeleteDialogComponent,
        CategoryPublisherDeletePopupComponent,
    ],
    providers: [
        CategoryPublisherService,
        CategoryPublisherPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirCategoryPublisherModule {}
