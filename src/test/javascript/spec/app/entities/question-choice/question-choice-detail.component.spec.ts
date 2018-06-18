/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { KavsirTestModule } from '../../../test.module';
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
                    QuestionChoiceService
                ]
            })
            .overrideTemplate(QuestionChoiceDetailComponent, '')
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

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new QuestionChoice(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.questionChoice).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
