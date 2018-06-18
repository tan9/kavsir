/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { KavsirTestModule } from '../../../test.module';
import { CategorySourceDetailComponent } from '../../../../../../main/webapp/app/entities/category-source/category-source-detail.component';
import { CategorySourceService } from '../../../../../../main/webapp/app/entities/category-source/category-source.service';
import { CategorySource } from '../../../../../../main/webapp/app/entities/category-source/category-source.model';

describe('Component Tests', () => {

    describe('CategorySource Management Detail Component', () => {
        let comp: CategorySourceDetailComponent;
        let fixture: ComponentFixture<CategorySourceDetailComponent>;
        let service: CategorySourceService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [CategorySourceDetailComponent],
                providers: [
                    CategorySourceService
                ]
            })
            .overrideTemplate(CategorySourceDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategorySourceDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategorySourceService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new CategorySource(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.categorySource).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
