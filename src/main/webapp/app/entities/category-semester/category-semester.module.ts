import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { KavsirSharedModule } from '../../shared';

import {
    CategorySemesterService,
    CategorySemesterPopupService,
    CategorySemesterComponent,
    CategorySemesterDetailComponent,
    CategorySemesterDialogComponent,
    CategorySemesterPopupComponent,
    CategorySemesterDeletePopupComponent,
    CategorySemesterDeleteDialogComponent,
    categorySemesterRoute,
    categorySemesterPopupRoute,
} from './';

let ENTITY_STATES = [
    ...categorySemesterRoute,
    ...categorySemesterPopupRoute,
];

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        CategorySemesterComponent,
        CategorySemesterDetailComponent,
        CategorySemesterDialogComponent,
        CategorySemesterDeleteDialogComponent,
        CategorySemesterPopupComponent,
        CategorySemesterDeletePopupComponent,
    ],
    entryComponents: [
        CategorySemesterComponent,
        CategorySemesterDialogComponent,
        CategorySemesterPopupComponent,
        CategorySemesterDeleteDialogComponent,
        CategorySemesterDeletePopupComponent,
    ],
    providers: [
        CategorySemesterService,
        CategorySemesterPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirCategorySemesterModule {}
