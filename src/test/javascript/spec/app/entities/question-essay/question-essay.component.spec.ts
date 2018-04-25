/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { KavsirTestModule } from '../../../test.module';
import { QuestionEssayComponent } from '../../../../../../main/webapp/app/entities/question-essay/question-essay.component';
import { QuestionEssayService } from '../../../../../../main/webapp/app/entities/question-essay/question-essay.service';
import { QuestionEssay } from '../../../../../../main/webapp/app/entities/question-essay/question-essay.model';

describe('Component Tests', () => {

    describe('QuestionEssay Management Component', () => {
        let comp: QuestionEssayComponent;
        let fixture: ComponentFixture<QuestionEssayComponent>;
        let service: QuestionEssayService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [QuestionEssayComponent],
                providers: [
                    QuestionEssayService
                ]
            })
            .overrideTemplate(QuestionEssayComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionEssayComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionEssayService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new QuestionEssay(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.questionEssays[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
