/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { CategoryGradeDetailComponent } from 'app/entities/category-grade/category-grade-detail.component';
import { CategoryGrade } from 'app/shared/model/category-grade.model';

describe('Component Tests', () => {
  describe('CategoryGrade Management Detail Component', () => {
    let comp: CategoryGradeDetailComponent;
    let fixture: ComponentFixture<CategoryGradeDetailComponent>;
    const route = ({ data: of({ categoryGrade: new CategoryGrade(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategoryGradeDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CategoryGradeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CategoryGradeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.categoryGrade).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
