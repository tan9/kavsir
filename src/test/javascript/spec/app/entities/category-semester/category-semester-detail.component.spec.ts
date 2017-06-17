import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { KavsirTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
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
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    CategorySemesterService,
                    JhiEventManager
                ]
            }).overrideTemplate(CategorySemesterDetailComponent, '')
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

            spyOn(service, 'find').and.returnValue(Observable.of(new CategorySemester(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.categorySemester).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
