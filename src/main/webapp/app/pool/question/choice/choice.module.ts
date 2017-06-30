import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KavsirSharedModule } from '../../../shared/shared.module';

import { ChoiceComponent } from './choice.component';
import { CategoryChoiceComponent } from './category-choice.component';
import { choiceRoute } from './choice.route';
import { KavsirQuestionChoiceModule } from '../../../entities/question-choice/question-choice.module';

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
