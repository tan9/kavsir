import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { KavsirSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [KavsirSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [KavsirSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirSharedModule {
  static forRoot() {
    return {
      ngModule: KavsirSharedModule
    };
  }
}
