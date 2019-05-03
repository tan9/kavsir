/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { CategoryNodeDetailComponent } from 'app/entities/category-node/category-node-detail.component';
import { CategoryNode } from 'app/shared/model/category-node.model';

describe('Component Tests', () => {
  describe('CategoryNode Management Detail Component', () => {
    let comp: CategoryNodeDetailComponent;
    let fixture: ComponentFixture<CategoryNodeDetailComponent>;
    const route = ({ data: of({ categoryNode: new CategoryNode(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategoryNodeDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CategoryNodeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CategoryNodeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.categoryNode).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
