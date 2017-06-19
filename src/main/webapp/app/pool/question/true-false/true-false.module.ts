import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KavsirSharedModule } from '../../../shared/shared.module';

import { TrueFalseComponent } from './true-false.component';
import { trueFalseRoute } from './true-false.route';
import { KavsirQuestionTrueFalseModule } from '../../../entities/question-true-false/question-true-false.module';

@NgModule({
    imports: [
        KavsirSharedModule,
        KavsirQuestionTrueFalseModule,
        RouterModule.forRoot(trueFalseRoute, {useHash: true}),
    ],
    declarations: [TrueFalseComponent]
})
export class TrueFalseModule {
}
