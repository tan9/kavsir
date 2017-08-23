import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { CategorySourceComponent } from './category-source.component';
import { CategorySourceDetailComponent } from './category-source-detail.component';
import { CategorySourcePopupComponent } from './category-source-dialog.component';
import { CategorySourceDeletePopupComponent } from './category-source-delete-dialog.component';

export const categorySourceRoute: Routes = [
    {
        path: 'category-source',
        component: CategorySourceComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categorySource.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'category-source/:id',
        component: CategorySourceDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categorySource.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const categorySourcePopupRoute: Routes = [
    {
        path: 'category-source-new',
        component: CategorySourcePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categorySource.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'category-source/:id/edit',
        component: CategorySourcePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categorySource.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'category-source/:id/delete',
        component: CategorySourceDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categorySource.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
