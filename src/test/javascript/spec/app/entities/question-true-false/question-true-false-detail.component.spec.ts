/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { QuestionTrueFalseDetailComponent } from 'app/entities/question-true-false/question-true-false-detail.component';
import { QuestionTrueFalse } from 'app/shared/model/question-true-false.model';

describe('Component Tests', () => {
  describe('QuestionTrueFalse Management Detail Component', () => {
    let comp: QuestionTrueFalseDetailComponent;
    let fixture: ComponentFixture<QuestionTrueFalseDetailComponent>;
    const route = ({ data: of({ questionTrueFalse: new QuestionTrueFalse(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [QuestionTrueFalseDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(QuestionTrueFalseDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(QuestionTrueFalseDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.questionTrueFalse).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
