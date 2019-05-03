import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { KavsirSharedLibsModule, KavsirSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [KavsirSharedLibsModule, KavsirSharedCommonModule],
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
