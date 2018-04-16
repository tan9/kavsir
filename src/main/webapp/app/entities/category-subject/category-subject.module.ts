import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { KavsirSharedModule } from '../../shared';
import {
    CategorySubjectService,
    CategorySubjectPopupService,
    CategorySubjectComponent,
    CategorySubjectDetailComponent,
    CategorySubjectDialogComponent,
    CategorySubjectPopupComponent,
    CategorySubjectDeletePopupComponent,
    CategorySubjectDeleteDialogComponent,
    categorySubjectRoute,
    categorySubjectPopupRoute,
} from './';

const ENTITY_STATES = [
    ...categorySubjectRoute,
    ...categorySubjectPopupRoute,
];

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        CategorySubjectComponent,
        CategorySubjectDetailComponent,
        CategorySubjectDialogComponent,
        CategorySubjectDeleteDialogComponent,
        CategorySubjectPopupComponent,
        CategorySubjectDeletePopupComponent,
    ],
    entryComponents: [
        CategorySubjectComponent,
        CategorySubjectDialogComponent,
        CategorySubjectPopupComponent,
        CategorySubjectDeleteDialogComponent,
        CategorySubjectDeletePopupComponent,
    ],
    providers: [
        CategorySubjectService,
        CategorySubjectPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirCategorySubjectModule {}
