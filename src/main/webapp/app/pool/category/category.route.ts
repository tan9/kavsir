import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';

import { CategoriesComponent } from './categories.component';
import { CategorySelectPopupComponent } from './category-select-dialog.component';

export const categoryRoute: Routes = [
    {
        path: 'categories',
        component: CategoriesComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'global.menu.pool.category.main'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const categoryPopupRoute: Routes = [
    {
        path: 'category-select/:id',
        component: CategorySelectPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'category.selector.label'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
