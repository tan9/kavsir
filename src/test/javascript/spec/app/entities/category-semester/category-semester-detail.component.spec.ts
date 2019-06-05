/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { CategorySemesterDetailComponent } from 'app/entities/category-semester/category-semester-detail.component';
import { CategorySemester } from 'app/shared/model/category-semester.model';

describe('Component Tests', () => {
  describe('CategorySemester Management Detail Component', () => {
    let comp: CategorySemesterDetailComponent;
    let fixture: ComponentFixture<CategorySemesterDetailComponent>;
    const route = ({ data: of({ categorySemester: new CategorySemester(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategorySemesterDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CategorySemesterDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CategorySemesterDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.categorySemester).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
