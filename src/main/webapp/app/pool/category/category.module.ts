import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { KavsirSharedModule } from '../../shared/shared.module';
import {
    categoryRoute,
    categoryPopupRoute,
    CategoriesComponent,
    CategoryComponent,
    CategorySelectDialogComponent,
    CategorySelectPopupComponent,
    CategorySelectPopupService
} from './';

const CATEGORY_STATES = [
    ...categoryRoute,
    ...categoryPopupRoute,
];

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forRoot(CATEGORY_STATES, {useHash: true}),
    ],
    declarations: [
        CategoriesComponent,
        CategoryComponent,
        CategorySelectDialogComponent,
        CategorySelectPopupComponent
    ],
    entryComponents: [
        CategoriesComponent,
        CategorySelectDialogComponent,
        CategorySelectPopupComponent
    ],
    providers: [
        CategorySelectPopupService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirCategoryModule {
}
