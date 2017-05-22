import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { KavsirSharedModule } from '../../shared';
import {
    QuestionChoiceService,
    QuestionChoicePopupService,
    QuestionChoiceComponent,
    QuestionChoiceDetailComponent,
    QuestionChoiceDialogComponent,
    QuestionChoicePopupComponent,
    QuestionChoiceDeletePopupComponent,
    QuestionChoiceDeleteDialogComponent,
    questionChoiceRoute,
    questionChoicePopupRoute,
} from './';

const ENTITY_STATES = [
    ...questionChoiceRoute,
    ...questionChoicePopupRoute,
];

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        QuestionChoiceComponent,
        QuestionChoiceDetailComponent,
        QuestionChoiceDialogComponent,
        QuestionChoiceDeleteDialogComponent,
        QuestionChoicePopupComponent,
        QuestionChoiceDeletePopupComponent,
    ],
    entryComponents: [
        QuestionChoiceComponent,
        QuestionChoiceDialogComponent,
        QuestionChoicePopupComponent,
        QuestionChoiceDeleteDialogComponent,
        QuestionChoiceDeletePopupComponent,
    ],
    providers: [
        QuestionChoiceService,
        QuestionChoicePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirQuestionChoiceModule {}
