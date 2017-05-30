import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CategoryModule } from './category/category.module';

@NgModule({
    imports: [
        CategoryModule,
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirPoolModule {}
