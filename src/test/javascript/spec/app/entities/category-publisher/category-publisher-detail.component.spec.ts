import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { DateUtils, DataUtils, EventManager } from 'ng-jhipster';
import { KavsirTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { CategoryPublisherDetailComponent } from '../../../../../../main/webapp/app/entities/category-publisher/category-publisher-detail.component';
import { CategoryPublisherService } from '../../../../../../main/webapp/app/entities/category-publisher/category-publisher.service';
import { CategoryPublisher } from '../../../../../../main/webapp/app/entities/category-publisher/category-publisher.model';

describe('Component Tests', () => {

    describe('CategoryPublisher Management Detail Component', () => {
        let comp: CategoryPublisherDetailComponent;
        let fixture: ComponentFixture<CategoryPublisherDetailComponent>;
        let service: CategoryPublisherService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [CategoryPublisherDetailComponent],
                providers: [
                    DateUtils,
                    DataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    CategoryPublisherService,
                    EventManager
                ]
            }).overrideTemplate(CategoryPublisherDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategoryPublisherDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategoryPublisherService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new CategoryPublisher(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.categoryPublisher).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
