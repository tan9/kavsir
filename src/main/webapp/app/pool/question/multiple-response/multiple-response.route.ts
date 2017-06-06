import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../../shared';
import { MultipleResponseComponent } from './multiple-response.component';

export const multipleResponseRoute: Routes = [
    {
        path: 'question/multiple-response',
        component: MultipleResponseComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'question.type.multipleResponse'
        },
        canActivate: [UserRouteAccessService]
    }
];
