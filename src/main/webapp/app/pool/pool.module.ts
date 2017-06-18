import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CategoryModule } from './category/category.module';
import { QuestionModule } from './question/question.module';

@NgModule({
    imports: [
        CategoryModule,
        QuestionModule
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirPoolModule {
}
