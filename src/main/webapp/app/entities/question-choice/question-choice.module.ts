import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { KavsirSharedModule } from '../../shared';
import {
    ChoiceOptionsComponent,
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
    QuestionChoiceResolvePagingParams,
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
        ChoiceOptionsComponent,
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
        QuestionChoiceResolvePagingParams,
    ],
    exports: [
        ChoiceOptionsComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirQuestionChoiceModule {}
