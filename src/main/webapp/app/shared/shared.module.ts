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
    CategoriesService
} from './';

@NgModule({
    imports: [
        KavsirSharedLibsModule,
        KavsirSharedCommonModule
    ],
    declarations: [
        JhiLoginModalComponent,
        HasAnyAuthorityDirective
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
        CategoriesService
    ],
    entryComponents: [JhiLoginModalComponent],
    exports: [
        KavsirSharedCommonModule,
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        DatePipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class KavsirSharedModule {}
