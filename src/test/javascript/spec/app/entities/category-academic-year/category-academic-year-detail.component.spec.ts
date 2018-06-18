/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { KavsirTestModule } from '../../../test.module';
import { CategoryAcademicYearDetailComponent } from '../../../../../../main/webapp/app/entities/category-academic-year/category-academic-year-detail.component';
import { CategoryAcademicYearService } from '../../../../../../main/webapp/app/entities/category-academic-year/category-academic-year.service';
import { CategoryAcademicYear } from '../../../../../../main/webapp/app/entities/category-academic-year/category-academic-year.model';

describe('Component Tests', () => {

    describe('CategoryAcademicYear Management Detail Component', () => {
        let comp: CategoryAcademicYearDetailComponent;
        let fixture: ComponentFixture<CategoryAcademicYearDetailComponent>;
        let service: CategoryAcademicYearService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [CategoryAcademicYearDetailComponent],
                providers: [
                    CategoryAcademicYearService
                ]
            })
            .overrideTemplate(CategoryAcademicYearDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategoryAcademicYearDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategoryAcademicYearService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new CategoryAcademicYear(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.categoryAcademicYear).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
