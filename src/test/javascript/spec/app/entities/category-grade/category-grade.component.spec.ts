/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { KavsirTestModule } from '../../../test.module';
import { CategoryGradeComponent } from '../../../../../../main/webapp/app/entities/category-grade/category-grade.component';
import { CategoryGradeService } from '../../../../../../main/webapp/app/entities/category-grade/category-grade.service';
import { CategoryGrade } from '../../../../../../main/webapp/app/entities/category-grade/category-grade.model';

describe('Component Tests', () => {

    describe('CategoryGrade Management Component', () => {
        let comp: CategoryGradeComponent;
        let fixture: ComponentFixture<CategoryGradeComponent>;
        let service: CategoryGradeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [CategoryGradeComponent],
                providers: [
                    CategoryGradeService
                ]
            })
            .overrideTemplate(CategoryGradeComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategoryGradeComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategoryGradeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new CategoryGrade(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.categoryGrades[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
