import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { CategorySemesterComponent } from './category-semester.component';
import { CategorySemesterDetailComponent } from './category-semester-detail.component';
import { CategorySemesterPopupComponent } from './category-semester-dialog.component';
import { CategorySemesterDeletePopupComponent } from './category-semester-delete-dialog.component';

export const categorySemesterRoute: Routes = [
    {
        path: 'category-semester',
        component: CategorySemesterComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categorySemester.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'category-semester/:id',
        component: CategorySemesterDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categorySemester.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const categorySemesterPopupRoute: Routes = [
    {
        path: 'category-semester-new',
        component: CategorySemesterPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categorySemester.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'category-semester/:id/edit',
        component: CategorySemesterPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categorySemester.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'category-semester/:id/delete',
        component: CategorySemesterDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categorySemester.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
