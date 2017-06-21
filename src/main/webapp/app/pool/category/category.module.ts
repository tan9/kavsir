import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CategoriesComponent } from './categories.component';
import { KavsirSharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { categoryRoute } from './category.route';

import { CategoryComponent } from './category.component';

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forRoot(categoryRoute, {useHash: true}),
    ],
    declarations: [
        CategoriesComponent,
        CategoryComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirCategoryModule {
}
