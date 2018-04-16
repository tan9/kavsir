/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { KavsirTestModule } from '../../../test.module';
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
                    QuestionEssayService
                ]
            })
            .overrideTemplate(QuestionEssayDetailComponent, '')
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

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new QuestionEssay(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.questionEssay).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
