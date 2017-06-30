import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KavsirSharedModule } from '../../../shared/shared.module';

import { EssayComponent } from './essay.component';
import { CategoryEssayComponent } from './category-essay.component';
import { essayRoute } from './essay.route';
import { KavsirQuestionEssayModule } from '../../../entities/question-essay/question-essay.module';

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
