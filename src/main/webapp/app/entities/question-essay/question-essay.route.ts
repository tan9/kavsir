import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { QuestionEssayComponent } from './question-essay.component';
import { QuestionEssayDetailComponent } from './question-essay-detail.component';
import { QuestionEssayPopupComponent } from './question-essay-dialog.component';
import { QuestionEssayDeletePopupComponent } from './question-essay-delete-dialog.component';

@Injectable()
export class QuestionEssayResolvePagingParams implements Resolve<any> {

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

export const questionEssayRoute: Routes = [
    {
        path: 'question-essay',
        component: QuestionEssayComponent,
        resolve: {
            'pagingParams': QuestionEssayResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionEssay.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'question-essay/:id',
        component: QuestionEssayDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionEssay.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const questionEssayPopupRoute: Routes = [
    {
        path: 'question-essay-new',
        component: QuestionEssayPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionEssay.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'question-essay/:id/edit',
        component: QuestionEssayPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionEssay.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'question-essay/:id/delete',
        component: QuestionEssayDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionEssay.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
