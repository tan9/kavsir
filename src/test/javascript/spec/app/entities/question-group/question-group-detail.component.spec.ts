/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { QuestionGroupDetailComponent } from 'app/entities/question-group/question-group-detail.component';
import { QuestionGroup } from 'app/shared/model/question-group.model';

describe('Component Tests', () => {
  describe('QuestionGroup Management Detail Component', () => {
    let comp: QuestionGroupDetailComponent;
    let fixture: ComponentFixture<QuestionGroupDetailComponent>;
    const route = ({ data: of({ questionGroup: new QuestionGroup(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [QuestionGroupDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(QuestionGroupDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(QuestionGroupDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.questionGroup).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
