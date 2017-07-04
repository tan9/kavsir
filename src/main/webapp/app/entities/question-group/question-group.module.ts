import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { KavsirSharedModule } from '../../shared';
import {
    QuestionGroupService,
    QuestionGroupPopupService,
    QuestionGroupComponent,
    QuestionGroupDetailComponent,
    QuestionGroupDialogComponent,
    QuestionGroupPopupComponent,
    QuestionGroupDeletePopupComponent,
    QuestionGroupDeleteDialogComponent,
    questionGroupRoute,
    questionGroupPopupRoute,
    QuestionGroupResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...questionGroupRoute,
    ...questionGroupPopupRoute,
];

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        QuestionGroupComponent,
        QuestionGroupDetailComponent,
        QuestionGroupDialogComponent,
        QuestionGroupDeleteDialogComponent,
        QuestionGroupPopupComponent,
        QuestionGroupDeletePopupComponent,
    ],
    entryComponents: [
        QuestionGroupComponent,
        QuestionGroupDialogComponent,
        QuestionGroupPopupComponent,
        QuestionGroupDeleteDialogComponent,
        QuestionGroupDeletePopupComponent,
    ],
    providers: [
        QuestionGroupService,
        QuestionGroupPopupService,
        QuestionGroupResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirQuestionGroupModule {}
