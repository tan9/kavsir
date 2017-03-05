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
import { QuestionChoiceOptionDetailComponent } from '../../../../../../main/webapp/app/entities/question-choice-option/question-choice-option-detail.component';
import { QuestionChoiceOptionService } from '../../../../../../main/webapp/app/entities/question-choice-option/question-choice-option.service';
import { QuestionChoiceOption } from '../../../../../../main/webapp/app/entities/question-choice-option/question-choice-option.model';

describe('Component Tests', () => {

    describe('QuestionChoiceOption Management Detail Component', () => {
        let comp: QuestionChoiceOptionDetailComponent;
        let fixture: ComponentFixture<QuestionChoiceOptionDetailComponent>;
        let service: QuestionChoiceOptionService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [QuestionChoiceOptionDetailComponent],
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
                    QuestionChoiceOptionService
                ]
            }).overrideComponent(QuestionChoiceOptionDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionChoiceOptionDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionChoiceOptionService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new QuestionChoiceOption(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.questionChoiceOption).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
