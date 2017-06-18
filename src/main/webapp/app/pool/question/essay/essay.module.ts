import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KavsirSharedModule } from '../../../shared/shared.module';

import { EssayComponent } from './essay.component';
import { essayRoute } from './essay.route';

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forRoot(essayRoute, {useHash: true}),
    ],
    declarations: [EssayComponent]
})
export class EssayModule {
}
