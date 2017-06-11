import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { DateUtils, DataUtils, EventManager } from 'ng-jhipster';
import { KavsirTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
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
                    DateUtils,
                    DataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    CategoryAcademicYearService,
                    EventManager
                ]
            }).overrideComponent(CategoryAcademicYearDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategoryAcademicYearDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategoryAcademicYearService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new CategoryAcademicYear(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.categoryAcademicYear).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
