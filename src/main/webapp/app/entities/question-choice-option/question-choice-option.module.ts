import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { KavsirSharedModule } from '../../shared';
import {
    QuestionChoiceOptionService,
    QuestionChoiceOptionPopupService,
    QuestionChoiceOptionComponent,
    QuestionChoiceOptionDetailComponent,
    QuestionChoiceOptionDialogComponent,
    QuestionChoiceOptionPopupComponent,
    QuestionChoiceOptionDeletePopupComponent,
    QuestionChoiceOptionDeleteDialogComponent,
    questionChoiceOptionRoute,
    questionChoiceOptionPopupRoute,
    QuestionChoiceOptionResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...questionChoiceOptionRoute,
    ...questionChoiceOptionPopupRoute,
];

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        QuestionChoiceOptionComponent,
        QuestionChoiceOptionDetailComponent,
        QuestionChoiceOptionDialogComponent,
        QuestionChoiceOptionDeleteDialogComponent,
        QuestionChoiceOptionPopupComponent,
        QuestionChoiceOptionDeletePopupComponent,
    ],
    entryComponents: [
        QuestionChoiceOptionComponent,
        QuestionChoiceOptionDialogComponent,
        QuestionChoiceOptionPopupComponent,
        QuestionChoiceOptionDeleteDialogComponent,
        QuestionChoiceOptionDeletePopupComponent,
    ],
    providers: [
        QuestionChoiceOptionService,
        QuestionChoiceOptionPopupService,
        QuestionChoiceOptionResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirQuestionChoiceOptionModule {}
