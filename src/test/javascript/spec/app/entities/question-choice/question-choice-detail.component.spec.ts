import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { DateUtils, DataUtils, EventManager } from 'ng-jhipster';
import { KavsirTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { QuestionChoiceDetailComponent } from '../../../../../../main/webapp/app/entities/question-choice/question-choice-detail.component';
import { QuestionChoiceService } from '../../../../../../main/webapp/app/entities/question-choice/question-choice.service';
import { QuestionChoice } from '../../../../../../main/webapp/app/entities/question-choice/question-choice.model';

describe('Component Tests', () => {

    describe('QuestionChoice Management Detail Component', () => {
        let comp: QuestionChoiceDetailComponent;
        let fixture: ComponentFixture<QuestionChoiceDetailComponent>;
        let service: QuestionChoiceService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [QuestionChoiceDetailComponent],
                providers: [
                    DateUtils,
                    DataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    QuestionChoiceService,
                    EventManager
                ]
            }).overrideTemplate(QuestionChoiceDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionChoiceDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionChoiceService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new QuestionChoice(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.questionChoice).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
