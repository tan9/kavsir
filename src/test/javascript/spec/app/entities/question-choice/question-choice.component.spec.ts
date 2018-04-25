/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { KavsirTestModule } from '../../../test.module';
import { QuestionChoiceComponent } from '../../../../../../main/webapp/app/entities/question-choice/question-choice.component';
import { QuestionChoiceService } from '../../../../../../main/webapp/app/entities/question-choice/question-choice.service';
import { QuestionChoice } from '../../../../../../main/webapp/app/entities/question-choice/question-choice.model';

describe('Component Tests', () => {

    describe('QuestionChoice Management Component', () => {
        let comp: QuestionChoiceComponent;
        let fixture: ComponentFixture<QuestionChoiceComponent>;
        let service: QuestionChoiceService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [QuestionChoiceComponent],
                providers: [
                    QuestionChoiceService
                ]
            })
            .overrideTemplate(QuestionChoiceComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionChoiceComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionChoiceService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new QuestionChoice(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.questionChoices[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
