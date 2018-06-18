/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { KavsirTestModule } from '../../../test.module';
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
                    ResourceImageService
                ]
            })
            .overrideTemplate(ResourceImageDetailComponent, '')
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

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new ResourceImage(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.resourceImage).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
