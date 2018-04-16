/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { KavsirTestModule } from '../../../test.module';
import { QuestionTrueFalseComponent } from '../../../../../../main/webapp/app/entities/question-true-false/question-true-false.component';
import { QuestionTrueFalseService } from '../../../../../../main/webapp/app/entities/question-true-false/question-true-false.service';
import { QuestionTrueFalse } from '../../../../../../main/webapp/app/entities/question-true-false/question-true-false.model';

describe('Component Tests', () => {

    describe('QuestionTrueFalse Management Component', () => {
        let comp: QuestionTrueFalseComponent;
        let fixture: ComponentFixture<QuestionTrueFalseComponent>;
        let service: QuestionTrueFalseService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [QuestionTrueFalseComponent],
                providers: [
                    QuestionTrueFalseService
                ]
            })
            .overrideTemplate(QuestionTrueFalseComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionTrueFalseComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionTrueFalseService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new QuestionTrueFalse(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.questionTrueFalses[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
