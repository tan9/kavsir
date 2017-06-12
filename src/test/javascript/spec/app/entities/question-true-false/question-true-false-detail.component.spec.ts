import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { DateUtils, DataUtils, EventManager } from 'ng-jhipster';
import { KavsirTestModule } from '../../../test.module';
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
                imports: [KavsirTestModule],
                declarations: [QuestionTrueFalseDetailComponent],
                providers: [
                    DateUtils,
                    DataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    QuestionTrueFalseService,
                    EventManager
                ]
            }).overrideTemplate(QuestionTrueFalseDetailComponent, '')
            .compileComponents();
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
