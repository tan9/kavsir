import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { CategoriesComponent } from './categories.component';

import { Principal } from '../../shared';

export const categoryRoute: Routes = [
    {
        path: 'categories',
        component: CategoriesComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'global.menu.pool.category.main'
        },
        canActivate: [UserRouteAccessService]
    }
];
