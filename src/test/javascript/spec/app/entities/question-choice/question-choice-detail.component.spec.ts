/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { QuestionChoiceDetailComponent } from 'app/entities/question-choice/question-choice-detail.component';
import { QuestionChoice } from 'app/shared/model/question-choice.model';

describe('Component Tests', () => {
  describe('QuestionChoice Management Detail Component', () => {
    let comp: QuestionChoiceDetailComponent;
    let fixture: ComponentFixture<QuestionChoiceDetailComponent>;
    const route = ({ data: of({ questionChoice: new QuestionChoice(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [QuestionChoiceDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(QuestionChoiceDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(QuestionChoiceDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.questionChoice).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
