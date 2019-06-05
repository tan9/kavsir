/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { QuestionChoiceOptionDetailComponent } from 'app/entities/question-choice-option/question-choice-option-detail.component';
import { QuestionChoiceOption } from 'app/shared/model/question-choice-option.model';

describe('Component Tests', () => {
  describe('QuestionChoiceOption Management Detail Component', () => {
    let comp: QuestionChoiceOptionDetailComponent;
    let fixture: ComponentFixture<QuestionChoiceOptionDetailComponent>;
    const route = ({ data: of({ questionChoiceOption: new QuestionChoiceOption(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [QuestionChoiceOptionDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(QuestionChoiceOptionDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(QuestionChoiceOptionDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.questionChoiceOption).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
