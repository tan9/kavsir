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
} from './';

let ENTITY_STATES = [
    ...questionChoiceOptionRoute,
    ...questionChoiceOptionPopupRoute,
];

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
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
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirQuestionChoiceOptionModule {}
