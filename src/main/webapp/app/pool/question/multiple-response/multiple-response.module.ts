import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KavsirSharedModule } from '../../../shared/shared.module';

import { MultipleResponseComponent } from './multiple-response.component';
import { multipleResponseRoute } from './multiple-response.route';

@NgModule({
  imports: [
      KavsirSharedModule,
      RouterModule.forRoot(multipleResponseRoute, {useHash: true}),
  ],
  declarations: [MultipleResponseComponent]
})
export class MultipleResponseModule { }
