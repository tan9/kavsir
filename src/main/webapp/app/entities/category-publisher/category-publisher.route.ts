import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { CategoryPublisherComponent } from './category-publisher.component';
import { CategoryPublisherDetailComponent } from './category-publisher-detail.component';
import { CategoryPublisherPopupComponent } from './category-publisher-dialog.component';
import { CategoryPublisherDeletePopupComponent } from './category-publisher-delete-dialog.component';

import { Principal } from '../../shared';

export const categoryPublisherRoute: Routes = [
    {
        path: 'category-publisher',
        component: CategoryPublisherComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryPublisher.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'category-publisher/:id',
        component: CategoryPublisherDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryPublisher.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const categoryPublisherPopupRoute: Routes = [
    {
        path: 'category-publisher-new',
        component: CategoryPublisherPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryPublisher.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'category-publisher/:id/edit',
        component: CategoryPublisherPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryPublisher.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'category-publisher/:id/delete',
        component: CategoryPublisherDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryPublisher.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
