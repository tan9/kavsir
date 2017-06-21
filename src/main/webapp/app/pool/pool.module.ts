import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { KavsirCategoryModule } from './category/category.module';
import { KavsirQuestionModule } from './question/question.module';
import { KavsirSharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        KavsirSharedModule,
        KavsirCategoryModule,
        KavsirQuestionModule
    ],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirPoolModule {
}
