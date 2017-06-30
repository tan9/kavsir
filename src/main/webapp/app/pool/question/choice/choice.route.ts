import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../../shared';
import { QuestionChoiceResolvePagingParams } from '../../../entities/question-choice';
import { ChoiceComponent } from './choice.component';

export const choiceRoute: Routes = [
    {
        path: 'question/choice',
        component: ChoiceComponent,
        resolve: {
            'pagingParams': QuestionChoiceResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'question.type.choice'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'question/multiple-response',
        component: ChoiceComponent,
        resolve: {
            'pagingParams': QuestionChoiceResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'question.type.multipleResponse'
        },
        canActivate: [UserRouteAccessService]
    }
];
