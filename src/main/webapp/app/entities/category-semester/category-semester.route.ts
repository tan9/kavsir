import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { CategorySemesterComponent } from './category-semester.component';
import { CategorySemesterDetailComponent } from './category-semester-detail.component';
import { CategorySemesterPopupComponent } from './category-semester-dialog.component';
import { CategorySemesterDeletePopupComponent } from './category-semester-delete-dialog.component';

import { Principal } from '../../shared';


export const categorySemesterRoute: Routes = [
  {
    path: 'category-semester',
    component: CategorySemesterComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.categorySemester.home.title'
    }
  }, {
    path: 'category-semester/:id',
    component: CategorySemesterDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.categorySemester.home.title'
    }
  }
];

export const categorySemesterPopupRoute: Routes = [
  {
    path: 'category-semester-new',
    component: CategorySemesterPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.categorySemester.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'category-semester/:id/edit',
    component: CategorySemesterPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.categorySemester.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'category-semester/:id/delete',
    component: CategorySemesterDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.categorySemester.home.title'
    },
    outlet: 'popup'
  }
];
