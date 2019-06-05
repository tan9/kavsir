/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { ResourceImageDetailComponent } from 'app/entities/resource-image/resource-image-detail.component';
import { ResourceImage } from 'app/shared/model/resource-image.model';

describe('Component Tests', () => {
  describe('ResourceImage Management Detail Component', () => {
    let comp: ResourceImageDetailComponent;
    let fixture: ComponentFixture<ResourceImageDetailComponent>;
    const route = ({ data: of({ resourceImage: new ResourceImage(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [ResourceImageDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ResourceImageDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ResourceImageDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.resourceImage).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
