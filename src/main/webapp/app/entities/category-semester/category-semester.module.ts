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

const ENTITY_STATES = [
    ...categorySemesterRoute,
    ...categorySemesterPopupRoute,
];

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forChild(ENTITY_STATES)
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
