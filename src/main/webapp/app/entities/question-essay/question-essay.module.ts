import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { KavsirSharedModule } from '../../shared';
import {
    QuestionEssayService,
    QuestionEssayPopupService,
    QuestionEssayComponent,
    QuestionEssayDetailComponent,
    QuestionEssayDialogComponent,
    QuestionEssayPopupComponent,
    QuestionEssayDeletePopupComponent,
    QuestionEssayDeleteDialogComponent,
    questionEssayRoute,
    questionEssayPopupRoute,
    QuestionEssayResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...questionEssayRoute,
    ...questionEssayPopupRoute,
];

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        QuestionEssayComponent,
        QuestionEssayDetailComponent,
        QuestionEssayDialogComponent,
        QuestionEssayDeleteDialogComponent,
        QuestionEssayPopupComponent,
        QuestionEssayDeletePopupComponent,
    ],
    entryComponents: [
        QuestionEssayComponent,
        QuestionEssayDialogComponent,
        QuestionEssayPopupComponent,
        QuestionEssayDeleteDialogComponent,
        QuestionEssayDeletePopupComponent,
    ],
    providers: [
        QuestionEssayService,
        QuestionEssayPopupService,
        QuestionEssayResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirQuestionEssayModule {}
