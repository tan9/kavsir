/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { KavsirTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { CategoryNodeDetailComponent } from '../../../../../../main/webapp/app/entities/category-node/category-node-detail.component';
import { CategoryNodeService } from '../../../../../../main/webapp/app/entities/category-node/category-node.service';
import { CategoryNode } from '../../../../../../main/webapp/app/entities/category-node/category-node.model';

describe('Component Tests', () => {

    describe('CategoryNode Management Detail Component', () => {
        let comp: CategoryNodeDetailComponent;
        let fixture: ComponentFixture<CategoryNodeDetailComponent>;
        let service: CategoryNodeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [CategoryNodeDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    CategoryNodeService,
                    JhiEventManager
                ]
            }).overrideTemplate(CategoryNodeDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategoryNodeDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategoryNodeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new CategoryNode(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.categoryNode).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
