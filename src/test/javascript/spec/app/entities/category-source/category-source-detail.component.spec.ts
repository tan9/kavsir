/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { KavsirTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { CategorySourceDetailComponent } from '../../../../../../main/webapp/app/entities/category-source/category-source-detail.component';
import { CategorySourceService } from '../../../../../../main/webapp/app/entities/category-source/category-source.service';
import { CategorySource } from '../../../../../../main/webapp/app/entities/category-source/category-source.model';

describe('Component Tests', () => {

    describe('CategorySource Management Detail Component', () => {
        let comp: CategorySourceDetailComponent;
        let fixture: ComponentFixture<CategorySourceDetailComponent>;
        let service: CategorySourceService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [CategorySourceDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    CategorySourceService,
                    JhiEventManager
                ]
            }).overrideTemplate(CategorySourceDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategorySourceDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategorySourceService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new CategorySource(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.categorySource).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
