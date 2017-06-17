import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { KavsirTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
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
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    CategoryGradeService,
                    JhiEventManager
                ]
            }).overrideTemplate(CategoryGradeDetailComponent, '')
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

            spyOn(service, 'find').and.returnValue(Observable.of(new CategoryGrade(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.categoryGrade).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
