/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { KavsirTestModule } from '../../../test.module';
import { CategorySemesterComponent } from '../../../../../../main/webapp/app/entities/category-semester/category-semester.component';
import { CategorySemesterService } from '../../../../../../main/webapp/app/entities/category-semester/category-semester.service';
import { CategorySemester } from '../../../../../../main/webapp/app/entities/category-semester/category-semester.model';

describe('Component Tests', () => {

    describe('CategorySemester Management Component', () => {
        let comp: CategorySemesterComponent;
        let fixture: ComponentFixture<CategorySemesterComponent>;
        let service: CategorySemesterService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [CategorySemesterComponent],
                providers: [
                    CategorySemesterService
                ]
            })
            .overrideTemplate(CategorySemesterComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategorySemesterComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategorySemesterService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new CategorySemester(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.categorySemesters[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
