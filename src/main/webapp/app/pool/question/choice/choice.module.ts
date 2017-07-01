import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KavsirSharedModule } from '../../../shared/shared.module';

import { KavsirQuestionChoiceModule } from '../../../entities/question-choice/question-choice.module';
import { ChoiceComponent, CategoryChoiceComponent, choiceRoute } from './';

@NgModule({
    imports: [
        KavsirSharedModule,
        KavsirQuestionChoiceModule,
        RouterModule.forRoot(choiceRoute, {useHash: true}),
    ],
    declarations: [
        ChoiceComponent,
        CategoryChoiceComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChoiceModule {
}
