/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { KavsirTestModule } from '../../../test.module';
import { CategoryGradeDetailComponent } from '../../../../../../main/webapp/app/entities/category-grade/category-grade-detail.component';
import { CategoryGradeService } from '../../../../../../main/webapp/app/entities/category-grade/category-grade.service';
import { CategoryGrade } from '../../../../../../main/webapp/app/entities/category-grade/category-grade.model';

describe('Component Tests', () => {

    describe('CategoryGrade Management Detail Component', () => {
        let comp: CategoryGradeDetailComponent;
        let fixture: ComponentFixture<CategoryGradeDetailComponent>;
        let service: CategoryGradeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [CategoryGradeDetailComponent],
                providers: [
                    CategoryGradeService
                ]
            })
            .overrideTemplate(CategoryGradeDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategoryGradeDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategoryGradeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new CategoryGrade(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.categoryGrade).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
