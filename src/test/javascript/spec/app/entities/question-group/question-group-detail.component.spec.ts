import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { DateUtils, DataUtils, EventManager } from 'ng-jhipster';
import { KavsirTestModule } from '../../../test.module';
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
                imports: [KavsirTestModule],
                declarations: [QuestionGroupDetailComponent],
                providers: [
                    DateUtils,
                    DataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    QuestionGroupService,
                    EventManager
                ]
            }).overrideTemplate(QuestionGroupDetailComponent, '')
            .compileComponents();
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
