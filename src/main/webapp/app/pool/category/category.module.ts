import { NgModule } from '@angular/core';
import { CategoryComponent } from './category.component';
import { KavsirSharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { categoryRoute } from './category.route';

import { TreeModule } from 'angular-tree-component';
import { CategoryHierarchyComponent } from './category-hierarchy.component';

@NgModule({
    imports: [
        KavsirSharedModule,
        TreeModule,
        RouterModule.forRoot(categoryRoute, {useHash: true}),
    ],
    providers: [],
    declarations: [
        CategoryComponent,
        CategoryHierarchyComponent
    ]
})
export class CategoryModule {
}
