/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { KavsirTestModule } from '../../../test.module';
import { CategorySemesterDetailComponent } from '../../../../../../main/webapp/app/entities/category-semester/category-semester-detail.component';
import { CategorySemesterService } from '../../../../../../main/webapp/app/entities/category-semester/category-semester.service';
import { CategorySemester } from '../../../../../../main/webapp/app/entities/category-semester/category-semester.model';

describe('Component Tests', () => {

    describe('CategorySemester Management Detail Component', () => {
        let comp: CategorySemesterDetailComponent;
        let fixture: ComponentFixture<CategorySemesterDetailComponent>;
        let service: CategorySemesterService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [CategorySemesterDetailComponent],
                providers: [
                    CategorySemesterService
                ]
            })
            .overrideTemplate(CategorySemesterDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategorySemesterDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategorySemesterService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new CategorySemester(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.categorySemester).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
