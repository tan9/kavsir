/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { KavsirTestModule } from '../../../test.module';
import { ResourceImageComponent } from '../../../../../../main/webapp/app/entities/resource-image/resource-image.component';
import { ResourceImageService } from '../../../../../../main/webapp/app/entities/resource-image/resource-image.service';
import { ResourceImage } from '../../../../../../main/webapp/app/entities/resource-image/resource-image.model';

describe('Component Tests', () => {

    describe('ResourceImage Management Component', () => {
        let comp: ResourceImageComponent;
        let fixture: ComponentFixture<ResourceImageComponent>;
        let service: ResourceImageService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [ResourceImageComponent],
                providers: [
                    ResourceImageService
                ]
            })
            .overrideTemplate(ResourceImageComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ResourceImageComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ResourceImageService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new ResourceImage(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.resourceImages[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
