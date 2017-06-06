import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KavsirSharedModule } from '../../../shared/shared.module';

import { TrueFalseComponent } from './true-false.component';
import { trueFalseRoute } from './true-false.route';

@NgModule({
  imports: [
      KavsirSharedModule,
      RouterModule.forRoot(trueFalseRoute, {useHash: true}),
  ],
  declarations: [TrueFalseComponent]
})
export class TrueFalseModule { }
