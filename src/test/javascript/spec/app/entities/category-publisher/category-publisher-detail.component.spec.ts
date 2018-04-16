/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { KavsirTestModule } from '../../../test.module';
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
                    CategoryPublisherService
                ]
            })
            .overrideTemplate(CategoryPublisherDetailComponent, '')
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

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new CategoryPublisher(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.categoryPublisher).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
