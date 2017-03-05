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
import { CategorySemesterDetailComponent } from '../../../../../../main/webapp/app/entities/category-semester/category-semester-detail.component';
import { CategorySemesterService } from '../../../../../../main/webapp/app/entities/category-semester/category-semester.service';
import { CategorySemester } from '../../../../../../main/webapp/app/entities/category-semester/category-semester.model';

describe('Component Tests', () => {

    describe('CategorySemester Management Detail Component', () => {
        let comp: CategorySemesterDetailComponent;
        let fixture: ComponentFixture<CategorySemesterDetailComponent>;
        let service: CategorySemesterService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [CategorySemesterDetailComponent],
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
                    CategorySemesterService
                ]
            }).overrideComponent(CategorySemesterDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategorySemesterDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategorySemesterService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new CategorySemester(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.categorySemester).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
