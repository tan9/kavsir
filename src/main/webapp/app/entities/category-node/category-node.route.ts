import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { CategoryNodeComponent } from './category-node.component';
import { CategoryNodeDetailComponent } from './category-node-detail.component';
import { CategoryNodePopupComponent } from './category-node-dialog.component';
import { CategoryNodeDeletePopupComponent } from './category-node-delete-dialog.component';

import { Principal } from '../../shared';

export const categoryNodeRoute: Routes = [
    {
        path: 'category-node',
        component: CategoryNodeComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryNode.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'category-node/:id',
        component: CategoryNodeDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryNode.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const categoryNodePopupRoute: Routes = [
    {
        path: 'category-node-new',
        component: CategoryNodePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryNode.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'category-node/:id/edit',
        component: CategoryNodePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryNode.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'category-node/:id/delete',
        component: CategoryNodeDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryNode.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
