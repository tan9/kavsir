/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { KavsirTestModule } from '../../../test.module';
import { CategoryPublisherComponent } from '../../../../../../main/webapp/app/entities/category-publisher/category-publisher.component';
import { CategoryPublisherService } from '../../../../../../main/webapp/app/entities/category-publisher/category-publisher.service';
import { CategoryPublisher } from '../../../../../../main/webapp/app/entities/category-publisher/category-publisher.model';

describe('Component Tests', () => {

    describe('CategoryPublisher Management Component', () => {
        let comp: CategoryPublisherComponent;
        let fixture: ComponentFixture<CategoryPublisherComponent>;
        let service: CategoryPublisherService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [CategoryPublisherComponent],
                providers: [
                    CategoryPublisherService
                ]
            })
            .overrideTemplate(CategoryPublisherComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategoryPublisherComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategoryPublisherService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new CategoryPublisher(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.categoryPublishers[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
