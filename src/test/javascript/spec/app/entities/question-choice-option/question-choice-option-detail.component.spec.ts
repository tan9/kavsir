/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { KavsirTestModule } from '../../../test.module';
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
                imports: [KavsirTestModule],
                declarations: [QuestionChoiceOptionDetailComponent],
                providers: [
                    QuestionChoiceOptionService
                ]
            })
            .overrideTemplate(QuestionChoiceOptionDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionChoiceOptionDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionChoiceOptionService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new QuestionChoiceOption(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.questionChoiceOption).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
