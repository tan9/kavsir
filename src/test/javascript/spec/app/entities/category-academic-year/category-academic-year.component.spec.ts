/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { KavsirTestModule } from '../../../test.module';
import { CategoryAcademicYearComponent } from '../../../../../../main/webapp/app/entities/category-academic-year/category-academic-year.component';
import { CategoryAcademicYearService } from '../../../../../../main/webapp/app/entities/category-academic-year/category-academic-year.service';
import { CategoryAcademicYear } from '../../../../../../main/webapp/app/entities/category-academic-year/category-academic-year.model';

describe('Component Tests', () => {

    describe('CategoryAcademicYear Management Component', () => {
        let comp: CategoryAcademicYearComponent;
        let fixture: ComponentFixture<CategoryAcademicYearComponent>;
        let service: CategoryAcademicYearService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [CategoryAcademicYearComponent],
                providers: [
                    CategoryAcademicYearService
                ]
            })
            .overrideTemplate(CategoryAcademicYearComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategoryAcademicYearComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategoryAcademicYearService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new CategoryAcademicYear(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.categoryAcademicYears[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
