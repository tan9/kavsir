import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { CategoryNodeComponent } from './category-node.component';
import { CategoryNodeDetailComponent } from './category-node-detail.component';
import { CategoryNodePopupComponent } from './category-node-dialog.component';
import { CategoryNodeDeletePopupComponent } from './category-node-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class CategoryNodeResolvePagingParams implements Resolve<any> {

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

export const categoryNodeRoute: Routes = [
    {
        path: 'category-node',
        component: CategoryNodeComponent,
        resolve: {
            'pagingParams': CategoryNodeResolvePagingParams
        },
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
