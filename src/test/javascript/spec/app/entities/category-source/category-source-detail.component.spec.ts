/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { CategorySourceDetailComponent } from 'app/entities/category-source/category-source-detail.component';
import { CategorySource } from 'app/shared/model/category-source.model';

describe('Component Tests', () => {
  describe('CategorySource Management Detail Component', () => {
    let comp: CategorySourceDetailComponent;
    let fixture: ComponentFixture<CategorySourceDetailComponent>;
    const route = ({ data: of({ categorySource: new CategorySource(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategorySourceDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CategorySourceDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CategorySourceDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.categorySource).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
