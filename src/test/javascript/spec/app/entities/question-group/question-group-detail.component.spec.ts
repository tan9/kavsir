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
import { QuestionGroupDetailComponent } from '../../../../../../main/webapp/app/entities/question-group/question-group-detail.component';
import { QuestionGroupService } from '../../../../../../main/webapp/app/entities/question-group/question-group.service';
import { QuestionGroup } from '../../../../../../main/webapp/app/entities/question-group/question-group.model';

describe('Component Tests', () => {

    describe('QuestionGroup Management Detail Component', () => {
        let comp: QuestionGroupDetailComponent;
        let fixture: ComponentFixture<QuestionGroupDetailComponent>;
        let service: QuestionGroupService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [QuestionGroupDetailComponent],
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
                    QuestionGroupService
                ]
            }).overrideComponent(QuestionGroupDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionGroupDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionGroupService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new QuestionGroup(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.questionGroup).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
