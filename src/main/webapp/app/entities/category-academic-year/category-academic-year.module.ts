import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { KavsirSharedModule } from '../../shared';
import {
    CategoryAcademicYearService,
    CategoryAcademicYearPopupService,
    CategoryAcademicYearComponent,
    CategoryAcademicYearDetailComponent,
    CategoryAcademicYearDialogComponent,
    CategoryAcademicYearPopupComponent,
    CategoryAcademicYearDeletePopupComponent,
    CategoryAcademicYearDeleteDialogComponent,
    categoryAcademicYearRoute,
    categoryAcademicYearPopupRoute,
} from './';

const ENTITY_STATES = [
    ...categoryAcademicYearRoute,
    ...categoryAcademicYearPopupRoute,
];

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        CategoryAcademicYearComponent,
        CategoryAcademicYearDetailComponent,
        CategoryAcademicYearDialogComponent,
        CategoryAcademicYearDeleteDialogComponent,
        CategoryAcademicYearPopupComponent,
        CategoryAcademicYearDeletePopupComponent,
    ],
    entryComponents: [
        CategoryAcademicYearComponent,
        CategoryAcademicYearDialogComponent,
        CategoryAcademicYearPopupComponent,
        CategoryAcademicYearDeleteDialogComponent,
        CategoryAcademicYearDeletePopupComponent,
    ],
    providers: [
        CategoryAcademicYearService,
        CategoryAcademicYearPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirCategoryAcademicYearModule {}
