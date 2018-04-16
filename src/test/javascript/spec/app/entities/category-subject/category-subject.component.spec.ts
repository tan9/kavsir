/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { KavsirTestModule } from '../../../test.module';
import { CategorySubjectComponent } from '../../../../../../main/webapp/app/entities/category-subject/category-subject.component';
import { CategorySubjectService } from '../../../../../../main/webapp/app/entities/category-subject/category-subject.service';
import { CategorySubject } from '../../../../../../main/webapp/app/entities/category-subject/category-subject.model';

describe('Component Tests', () => {

    describe('CategorySubject Management Component', () => {
        let comp: CategorySubjectComponent;
        let fixture: ComponentFixture<CategorySubjectComponent>;
        let service: CategorySubjectService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [CategorySubjectComponent],
                providers: [
                    CategorySubjectService
                ]
            })
            .overrideTemplate(CategorySubjectComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategorySubjectComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategorySubjectService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new CategorySubject(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.categorySubjects[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
