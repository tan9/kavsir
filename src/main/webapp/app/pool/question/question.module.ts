import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KavsirSharedModule } from '../../shared/shared.module';

import { QuestionComponent } from './question.component';
import { questionRoute } from './question.route';

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forRoot(questionRoute, {useHash: true}),
    ],
    declarations: [QuestionComponent]
})
export class QuestionModule {
}
