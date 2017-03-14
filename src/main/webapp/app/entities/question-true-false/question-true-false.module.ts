import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { KavsirSharedModule } from '../../shared';

import {
    QuestionTrueFalseService,
    QuestionTrueFalsePopupService,
    QuestionTrueFalseComponent,
    QuestionTrueFalseDetailComponent,
    QuestionTrueFalseDialogComponent,
    QuestionTrueFalsePopupComponent,
    QuestionTrueFalseDeletePopupComponent,
    QuestionTrueFalseDeleteDialogComponent,
    questionTrueFalseRoute,
    questionTrueFalsePopupRoute,
} from './';

let ENTITY_STATES = [
    ...questionTrueFalseRoute,
    ...questionTrueFalsePopupRoute,
];

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        QuestionTrueFalseComponent,
        QuestionTrueFalseDetailComponent,
        QuestionTrueFalseDialogComponent,
        QuestionTrueFalseDeleteDialogComponent,
        QuestionTrueFalsePopupComponent,
        QuestionTrueFalseDeletePopupComponent,
    ],
    entryComponents: [
        QuestionTrueFalseComponent,
        QuestionTrueFalseDialogComponent,
        QuestionTrueFalsePopupComponent,
        QuestionTrueFalseDeleteDialogComponent,
        QuestionTrueFalseDeletePopupComponent,
    ],
    providers: [
        QuestionTrueFalseService,
        QuestionTrueFalsePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirQuestionTrueFalseModule {}
