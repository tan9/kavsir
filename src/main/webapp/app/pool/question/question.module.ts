import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KavsirSharedModule } from '../../shared/shared.module';

import { QuestionComponent } from './question.component';
import { questionRoute } from './question.route';
import { TrueFalseModule } from './true-false/true-false.module';
import { ChoiceModule } from './choice/choice.module';
import { MultipleResponseModule } from './multiple-response/multiple-response.module';
import { EssayModule } from './essay/essay.module';

@NgModule({
    imports: [
        KavsirSharedModule,
        TrueFalseModule,
        ChoiceModule,
        MultipleResponseModule,
        EssayModule,
        RouterModule.forRoot(questionRoute, {useHash: true})
    ],
    declarations: [QuestionComponent]
})
export class QuestionModule {
}
