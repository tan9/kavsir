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

let ENTITY_STATES = [
    ...categorySubjectRoute,
    ...categorySubjectPopupRoute,
];

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
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
