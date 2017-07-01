import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KavsirSharedModule } from '../../../shared/shared.module';

import { KavsirQuestionTrueFalseModule } from '../../../entities/question-true-false/question-true-false.module';
import { TrueFalseComponent, CategoryTrueFalseComponent, trueFalseRoute } from './';

@NgModule({
    imports: [
        KavsirSharedModule,
        KavsirQuestionTrueFalseModule,
        RouterModule.forRoot(trueFalseRoute, {useHash: true}),
    ],
    declarations: [
        TrueFalseComponent,
        CategoryTrueFalseComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrueFalseModule {
}
