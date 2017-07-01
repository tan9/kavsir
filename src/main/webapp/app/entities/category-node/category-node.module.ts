import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { KavsirSharedModule } from '../../shared';
import {
    CategoryNodeService,
    CategoryNodePopupService,
    CategoryNodeComponent,
    CategoryNodeDetailComponent,
    CategoryNodeDialogComponent,
    CategoryNodePopupComponent,
    CategoryNodeDeletePopupComponent,
    CategoryNodeDeleteDialogComponent,
    categoryNodeRoute,
    categoryNodePopupRoute,
    CategoryNodeResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...categoryNodeRoute,
    ...categoryNodePopupRoute,
];

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        CategoryNodeComponent,
        CategoryNodeDetailComponent,
        CategoryNodeDialogComponent,
        CategoryNodeDeleteDialogComponent,
        CategoryNodePopupComponent,
        CategoryNodeDeletePopupComponent,
    ],
    entryComponents: [
        CategoryNodeComponent,
        CategoryNodeDialogComponent,
        CategoryNodePopupComponent,
        CategoryNodeDeleteDialogComponent,
        CategoryNodeDeletePopupComponent,
    ],
    providers: [
        CategoryNodeService,
        CategoryNodePopupService,
        CategoryNodeResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirCategoryNodeModule {}
