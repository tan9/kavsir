import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../../shared';
import { ChoiceComponent } from './choice.component';

export const choiceRoute: Routes = [
    {
        path: 'question/choice',
        component: ChoiceComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'question.type.choice'
        },
        canActivate: [UserRouteAccessService]
    }
];
