import { NgModule } from '@angular/core';
import { CategoryComponent } from './category.component';
import { KavsirSharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { categoryRoute } from './category.route';

import { TreeModule } from 'angular-tree-component';
import { CategoryAcademicYearService } from '../../entities/category-academic-year/category-academic-year.service';

@NgModule({
    imports: [
        KavsirSharedModule,
        TreeModule,
        RouterModule.forRoot(categoryRoute, {useHash: true}),
    ],
    providers: [
        CategoryAcademicYearService
    ],
    declarations: [CategoryComponent]
})
export class CategoryModule {
}