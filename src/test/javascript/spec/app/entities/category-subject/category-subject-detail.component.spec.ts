/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { KavsirTestModule } from '../../../test.module';
import { CategorySubjectDetailComponent } from '../../../../../../main/webapp/app/entities/category-subject/category-subject-detail.component';
import { CategorySubjectService } from '../../../../../../main/webapp/app/entities/category-subject/category-subject.service';
import { CategorySubject } from '../../../../../../main/webapp/app/entities/category-subject/category-subject.model';

describe('Component Tests', () => {

    describe('CategorySubject Management Detail Component', () => {
        let comp: CategorySubjectDetailComponent;
        let fixture: ComponentFixture<CategorySubjectDetailComponent>;
        let service: CategorySubjectService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [CategorySubjectDetailComponent],
                providers: [
                    CategorySubjectService
                ]
            })
            .overrideTemplate(CategorySubjectDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategorySubjectDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategorySubjectService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new CategorySubject(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.categorySubject).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
