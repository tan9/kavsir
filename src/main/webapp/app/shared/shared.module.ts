import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';

import { CookieService } from 'angular2-cookie/services/cookies.service';
import {
    KavsirSharedLibsModule,
    KavsirSharedCommonModule,
    CSRFService,
    AuthService,
    AuthServerProvider,
    AccountService,
    UserService,
    StateStorageService,
    LoginService,
    LoginModalService,
    Principal,
    HasAuthorityDirective,
    HasAnyAuthorityDirective,
    JhiLoginModalComponent
} from './';

@NgModule({
    imports: [
        KavsirSharedLibsModule,
        KavsirSharedCommonModule
    ],
    declarations: [
        JhiLoginModalComponent,
        HasAuthorityDirective,
        HasAnyAuthorityDirective
    ],
    providers: [
        CookieService,
        LoginService,
        LoginModalService,
        AccountService,
        StateStorageService,
        Principal,
        CSRFService,
        AuthServerProvider,
        AuthService,
        UserService,
        DatePipe
    ],
    entryComponents: [JhiLoginModalComponent],
    exports: [
        KavsirSharedCommonModule,
        JhiLoginModalComponent,
        HasAuthorityDirective,
        HasAnyAuthorityDirective,
        DatePipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class KavsirSharedModule {}
