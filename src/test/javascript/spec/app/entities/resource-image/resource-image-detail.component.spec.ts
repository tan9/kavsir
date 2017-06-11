import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { DateUtils, DataUtils, EventManager } from 'ng-jhipster';
import { KavsirTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { ResourceImageDetailComponent } from '../../../../../../main/webapp/app/entities/resource-image/resource-image-detail.component';
import { ResourceImageService } from '../../../../../../main/webapp/app/entities/resource-image/resource-image.service';
import { ResourceImage } from '../../../../../../main/webapp/app/entities/resource-image/resource-image.model';

describe('Component Tests', () => {

    describe('ResourceImage Management Detail Component', () => {
        let comp: ResourceImageDetailComponent;
        let fixture: ComponentFixture<ResourceImageDetailComponent>;
        let service: ResourceImageService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [ResourceImageDetailComponent],
                providers: [
                    DateUtils,
                    DataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    ResourceImageService,
                    EventManager
                ]
            }).overrideTemplate(ResourceImageDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ResourceImageDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ResourceImageService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new ResourceImage(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.resourceImage).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
