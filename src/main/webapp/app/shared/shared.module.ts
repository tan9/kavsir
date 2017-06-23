import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';

import {
    KavsirSharedLibsModule,
    KavsirSharedCommonModule,
    CSRFService,
    AuthServerProvider,
    AccountService,
    UserService,
    StateStorageService,
    LoginService,
    LoginModalService,
    Principal,
    HasAnyAuthorityDirective,
    JhiLoginModalComponent,
    CategoriesService,
    CategoryHierarchyComponent,
    CategoryHierarchyService,
    CategorySelectComponent,
    MathJaxDirective
} from './';

@NgModule({
    imports: [
        KavsirSharedLibsModule,
        KavsirSharedCommonModule
    ],
    declarations: [
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        CategoryHierarchyComponent,
        CategorySelectComponent,
        MathJaxDirective
    ],
    providers: [
        LoginService,
        LoginModalService,
        AccountService,
        StateStorageService,
        Principal,
        CSRFService,
        AuthServerProvider,
        UserService,
        DatePipe,
        CategoriesService,
        CategoryHierarchyService
    ],
    entryComponents: [JhiLoginModalComponent],
    exports: [
        KavsirSharedCommonModule,
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        DatePipe,
        CategoryHierarchyComponent,
        CategorySelectComponent,
        MathJaxDirective
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class KavsirSharedModule {}
