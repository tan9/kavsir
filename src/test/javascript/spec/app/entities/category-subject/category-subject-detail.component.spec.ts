/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { CategorySubjectDetailComponent } from 'app/entities/category-subject/category-subject-detail.component';
import { CategorySubject } from 'app/shared/model/category-subject.model';

describe('Component Tests', () => {
  describe('CategorySubject Management Detail Component', () => {
    let comp: CategorySubjectDetailComponent;
    let fixture: ComponentFixture<CategorySubjectDetailComponent>;
    const route = ({ data: of({ categorySubject: new CategorySubject(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategorySubjectDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CategorySubjectDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CategorySubjectDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.categorySubject).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
