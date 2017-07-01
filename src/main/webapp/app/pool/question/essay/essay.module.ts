import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KavsirSharedModule } from '../../../shared/shared.module';

import { KavsirQuestionEssayModule } from '../../../entities/question-essay/question-essay.module';
import { EssayComponent, CategoryEssayComponent, essayRoute } from './';

@NgModule({
    imports: [
        KavsirSharedModule,
        KavsirQuestionEssayModule,
        RouterModule.forRoot(essayRoute, {useHash: true}),
    ],
    declarations: [
        EssayComponent,
        CategoryEssayComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EssayModule {
}
