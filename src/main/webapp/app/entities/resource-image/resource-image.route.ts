import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { ResourceImageComponent } from './resource-image.component';
import { ResourceImageDetailComponent } from './resource-image-detail.component';
import { ResourceImagePopupComponent } from './resource-image-dialog.component';
import { ResourceImageDeletePopupComponent } from './resource-image-delete-dialog.component';

import { Principal } from '../../shared';


export const resourceImageRoute: Routes = [
  {
    path: 'resource-image',
    component: ResourceImageComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.resourceImage.home.title'
    },
    canActivate: [UserRouteAccessService]
  }, {
    path: 'resource-image/:id',
    component: ResourceImageDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.resourceImage.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const resourceImagePopupRoute: Routes = [
  {
    path: 'resource-image-new',
    component: ResourceImagePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.resourceImage.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'resource-image/:id/edit',
    component: ResourceImagePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.resourceImage.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'resource-image/:id/delete',
    component: ResourceImageDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.resourceImage.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
