import { NgModule } from '@angular/core';

import {
  KavsirSharedLibsModule,
  FindLanguageFromKeyPipe,
  JhiAlertComponent,
  JhiAlertErrorComponent,
  CategoriesService,
  CategoryHierarchyComponent,
  CategoryHierarchyService,
  CategoryPathNamePipe,
  CategorySelectComponent,
  MathJaxDirective,
  ChoiceOptionsComponent,
  ImagesComponent,
  ImagesPipe,
  TrueFalseSymbolPipe,
  MarkupRenderComponent
} from './';

@NgModule({
  imports: [KavsirSharedLibsModule],
  declarations: [
    FindLanguageFromKeyPipe,
    JhiAlertComponent,
    JhiAlertErrorComponent,
    CategoryHierarchyComponent,
    CategoryPathNamePipe,
    CategorySelectComponent,
    MathJaxDirective,
    ChoiceOptionsComponent,
    ImagesComponent,
    ImagesPipe,
    TrueFalseSymbolPipe,
    MarkupRenderComponent
  ],
  providers: [CategoriesService, CategoryHierarchyService],
  exports: [
    KavsirSharedLibsModule,
    FindLanguageFromKeyPipe,
    JhiAlertComponent,
    JhiAlertErrorComponent,
    CategoryHierarchyComponent,
    CategoryPathNamePipe,
    CategorySelectComponent,
    MathJaxDirective,
    ChoiceOptionsComponent,
    ImagesComponent,
    ImagesPipe,
    TrueFalseSymbolPipe,
    MarkupRenderComponent
  ]
})
export class KavsirSharedCommonModule {}
