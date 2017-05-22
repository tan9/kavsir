import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { CategoryAcademicYearComponent } from './category-academic-year.component';
import { CategoryAcademicYearDetailComponent } from './category-academic-year-detail.component';
import { CategoryAcademicYearPopupComponent } from './category-academic-year-dialog.component';
import { CategoryAcademicYearDeletePopupComponent } from './category-academic-year-delete-dialog.component';

import { Principal } from '../../shared';

export const categoryAcademicYearRoute: Routes = [
    {
        path: 'category-academic-year',
        component: CategoryAcademicYearComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryAcademicYear.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'category-academic-year/:id',
        component: CategoryAcademicYearDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryAcademicYear.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const categoryAcademicYearPopupRoute: Routes = [
    {
        path: 'category-academic-year-new',
        component: CategoryAcademicYearPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryAcademicYear.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'category-academic-year/:id/edit',
        component: CategoryAcademicYearPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryAcademicYear.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'category-academic-year/:id/delete',
        component: CategoryAcademicYearDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryAcademicYear.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
