/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { KavsirTestModule } from '../../../test.module';
import { QuestionChoiceOptionComponent } from '../../../../../../main/webapp/app/entities/question-choice-option/question-choice-option.component';
import { QuestionChoiceOptionService } from '../../../../../../main/webapp/app/entities/question-choice-option/question-choice-option.service';
import { QuestionChoiceOption } from '../../../../../../main/webapp/app/entities/question-choice-option/question-choice-option.model';

describe('Component Tests', () => {

    describe('QuestionChoiceOption Management Component', () => {
        let comp: QuestionChoiceOptionComponent;
        let fixture: ComponentFixture<QuestionChoiceOptionComponent>;
        let service: QuestionChoiceOptionService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [QuestionChoiceOptionComponent],
                providers: [
                    QuestionChoiceOptionService
                ]
            })
            .overrideTemplate(QuestionChoiceOptionComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionChoiceOptionComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionChoiceOptionService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new QuestionChoiceOption(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.questionChoiceOptions[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
