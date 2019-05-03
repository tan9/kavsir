/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { QuestionEssayDetailComponent } from 'app/entities/question-essay/question-essay-detail.component';
import { QuestionEssay } from 'app/shared/model/question-essay.model';

describe('Component Tests', () => {
  describe('QuestionEssay Management Detail Component', () => {
    let comp: QuestionEssayDetailComponent;
    let fixture: ComponentFixture<QuestionEssayDetailComponent>;
    const route = ({ data: of({ questionEssay: new QuestionEssay(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [QuestionEssayDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(QuestionEssayDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(QuestionEssayDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.questionEssay).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
