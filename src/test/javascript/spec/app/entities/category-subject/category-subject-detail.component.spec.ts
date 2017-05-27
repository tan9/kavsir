import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { DateUtils, DataUtils, EventManager } from 'ng-jhipster';
import { KavsirTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
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
                    DateUtils,
                    DataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    CategorySubjectService,
                    EventManager
                ]
            }).overrideComponent(CategorySubjectDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategorySubjectDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategorySubjectService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new CategorySubject(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.categorySubject).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});