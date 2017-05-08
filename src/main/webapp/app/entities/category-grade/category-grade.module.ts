import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { KavsirSharedModule } from '../../shared';
import {
    CategoryGradeService,
    CategoryGradePopupService,
    CategoryGradeComponent,
    CategoryGradeDetailComponent,
    CategoryGradeDialogComponent,
    CategoryGradePopupComponent,
    CategoryGradeDeletePopupComponent,
    CategoryGradeDeleteDialogComponent,
    categoryGradeRoute,
    categoryGradePopupRoute,
} from './';

const ENTITY_STATES = [
    ...categoryGradeRoute,
    ...categoryGradePopupRoute,
];

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        CategoryGradeComponent,
        CategoryGradeDetailComponent,
        CategoryGradeDialogComponent,
        CategoryGradeDeleteDialogComponent,
        CategoryGradePopupComponent,
        CategoryGradeDeletePopupComponent,
    ],
    entryComponents: [
        CategoryGradeComponent,
        CategoryGradeDialogComponent,
        CategoryGradePopupComponent,
        CategoryGradeDeleteDialogComponent,
        CategoryGradeDeletePopupComponent,
    ],
    providers: [
        CategoryGradeService,
        CategoryGradePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirCategoryGradeModule {}
