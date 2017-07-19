import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { CategoryGradeComponent } from './category-grade.component';
import { CategoryGradeDetailComponent } from './category-grade-detail.component';
import { CategoryGradePopupComponent } from './category-grade-dialog.component';
import { CategoryGradeDeletePopupComponent } from './category-grade-delete-dialog.component';

export const categoryGradeRoute: Routes = [
    {
        path: 'category-grade',
        component: CategoryGradeComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryGrade.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'category-grade/:id',
        component: CategoryGradeDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryGrade.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const categoryGradePopupRoute: Routes = [
    {
        path: 'category-grade-new',
        component: CategoryGradePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryGrade.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'category-grade/:id/edit',
        component: CategoryGradePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryGrade.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'category-grade/:id/delete',
        component: CategoryGradeDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryGrade.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
