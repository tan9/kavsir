import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { KavsirCategoryModule } from './category/category.module';
import { KavsirQuestionModule } from './question/question.module';

@NgModule({
    imports: [
        KavsirCategoryModule,
        KavsirQuestionModule
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirPoolModule {
}
