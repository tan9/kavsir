/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { KavsirTestModule } from '../../../test.module';
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
                    QuestionTrueFalseService
                ]
            })
            .overrideTemplate(QuestionTrueFalseDetailComponent, '')
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

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new QuestionTrueFalse(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.questionTrueFalse).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
