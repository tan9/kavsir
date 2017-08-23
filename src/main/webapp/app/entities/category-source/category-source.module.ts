import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { KavsirSharedModule } from '../../shared';
import {
    CategorySourceService,
    CategorySourcePopupService,
    CategorySourceComponent,
    CategorySourceDetailComponent,
    CategorySourceDialogComponent,
    CategorySourcePopupComponent,
    CategorySourceDeletePopupComponent,
    CategorySourceDeleteDialogComponent,
    categorySourceRoute,
    categorySourcePopupRoute,
} from './';

const ENTITY_STATES = [
    ...categorySourceRoute,
    ...categorySourcePopupRoute,
];

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        CategorySourceComponent,
        CategorySourceDetailComponent,
        CategorySourceDialogComponent,
        CategorySourceDeleteDialogComponent,
        CategorySourcePopupComponent,
        CategorySourceDeletePopupComponent,
    ],
    entryComponents: [
        CategorySourceComponent,
        CategorySourceDialogComponent,
        CategorySourcePopupComponent,
        CategorySourceDeleteDialogComponent,
        CategorySourceDeletePopupComponent,
    ],
    providers: [
        CategorySourceService,
        CategorySourcePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirCategorySourceModule {}
