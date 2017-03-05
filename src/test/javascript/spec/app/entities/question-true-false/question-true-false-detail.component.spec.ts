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
import { QuestionTrueFalseDetailComponent } from '../../../../../../main/webapp/app/entities/question-true-false/question-true-false-detail.component';
import { QuestionTrueFalseService } from '../../../../../../main/webapp/app/entities/question-true-false/question-true-false.service';
import { QuestionTrueFalse } from '../../../../../../main/webapp/app/entities/question-true-false/question-true-false.model';

describe('Component Tests', () => {

    describe('QuestionTrueFalse Management Detail Component', () => {
        let comp: QuestionTrueFalseDetailComponent;
        let fixture: ComponentFixture<QuestionTrueFalseDetailComponent>;
        let service: QuestionTrueFalseService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [QuestionTrueFalseDetailComponent],
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
                    QuestionTrueFalseService
                ]
            }).overrideComponent(QuestionTrueFalseDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionTrueFalseDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionTrueFalseService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new QuestionTrueFalse(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.questionTrueFalse).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
