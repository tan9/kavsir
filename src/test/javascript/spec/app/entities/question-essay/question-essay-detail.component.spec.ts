/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { KavsirTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { QuestionEssayDetailComponent } from '../../../../../../main/webapp/app/entities/question-essay/question-essay-detail.component';
import { QuestionEssayService } from '../../../../../../main/webapp/app/entities/question-essay/question-essay.service';
import { QuestionEssay } from '../../../../../../main/webapp/app/entities/question-essay/question-essay.model';

describe('Component Tests', () => {

    describe('QuestionEssay Management Detail Component', () => {
        let comp: QuestionEssayDetailComponent;
        let fixture: ComponentFixture<QuestionEssayDetailComponent>;
        let service: QuestionEssayService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [QuestionEssayDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    QuestionEssayService,
                    JhiEventManager
                ]
            }).overrideTemplate(QuestionEssayDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionEssayDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionEssayService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new QuestionEssay(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.questionEssay).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
