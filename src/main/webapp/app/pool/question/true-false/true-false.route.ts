import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../../shared';
import { TrueFalseComponent } from './true-false.component';
import { QuestionTrueFalseResolvePagingParams } from '../../../entities/question-true-false/question-true-false.route';

export const trueFalseRoute: Routes = [
    {
        path: 'question/true-false',
        component: TrueFalseComponent,
        resolve: {
            'pagingParams': QuestionTrueFalseResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'question.type.trueFalse'
        },
        canActivate: [UserRouteAccessService]
    }
];
