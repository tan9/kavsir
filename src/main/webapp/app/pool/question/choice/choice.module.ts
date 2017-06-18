import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KavsirSharedModule } from '../../../shared/shared.module';

import { ChoiceComponent } from './choice.component';
import { choiceRoute } from './choice.route';

@NgModule({
    imports: [
        KavsirSharedModule,
        RouterModule.forRoot(choiceRoute, {useHash: true}),
    ],
    declarations: [ChoiceComponent]
})
export class ChoiceModule {
}
