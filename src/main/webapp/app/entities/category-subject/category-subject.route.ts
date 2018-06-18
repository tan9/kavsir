import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { CategorySubjectComponent } from './category-subject.component';
import { CategorySubjectDetailComponent } from './category-subject-detail.component';
import { CategorySubjectPopupComponent } from './category-subject-dialog.component';
import { CategorySubjectDeletePopupComponent } from './category-subject-delete-dialog.component';

export const categorySubjectRoute: Routes = [
    {
        path: 'category-subject',
        component: CategorySubjectComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categorySubject.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'category-subject/:id',
        component: CategorySubjectDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categorySubject.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const categorySubjectPopupRoute: Routes = [
    {
        path: 'category-subject-new',
        component: CategorySubjectPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categorySubject.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'category-subject/:id/edit',
        component: CategorySubjectPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categorySubject.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'category-subject/:id/delete',
        component: CategorySubjectDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categorySubject.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
