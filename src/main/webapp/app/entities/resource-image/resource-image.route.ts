import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { ResourceImageComponent } from './resource-image.component';
import { ResourceImageDetailComponent } from './resource-image-detail.component';
import { ResourceImagePopupComponent } from './resource-image-dialog.component';
import { ResourceImageDeletePopupComponent } from './resource-image-delete-dialog.component';

@Injectable()
export class ResourceImageResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
      };
    }
}

export const resourceImageRoute: Routes = [
    {
        path: 'resource-image',
        component: ResourceImageComponent,
        resolve: {
            'pagingParams': ResourceImageResolvePagingParams
        },
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
