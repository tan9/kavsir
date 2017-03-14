import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { DateUtils, DataUtils } from 'ng-jhipster';
import { JhiLanguageService } from 'ng-jhipster';
import { MockLanguageService } from '../../../helpers/mock-language.service';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { CategoryNodeDetailComponent } from '../../../../../../main/webapp/app/entities/category-node/category-node-detail.component';
import { CategoryNodeService } from '../../../../../../main/webapp/app/entities/category-node/category-node.service';
import { CategoryNode } from '../../../../../../main/webapp/app/entities/category-node/category-node.model';

describe('Component Tests', () => {

    describe('CategoryNode Management Detail Component', () => {
        let comp: CategoryNodeDetailComponent;
        let fixture: ComponentFixture<CategoryNodeDetailComponent>;
        let service: CategoryNodeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [CategoryNodeDetailComponent],
                providers: [
                    MockBackend,
                    BaseRequestOptions,
                    DateUtils,
                    DataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    {
                        provide: Http,
                        useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
                            return new Http(backendInstance, defaultOptions);
                        },
                        deps: [MockBackend, BaseRequestOptions]
                    },
                    {
                        provide: JhiLanguageService,
                        useClass: MockLanguageService
                    },
                    CategoryNodeService
                ]
            }).overrideComponent(CategoryNodeDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategoryNodeDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategoryNodeService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new CategoryNode(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.categoryNode).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
