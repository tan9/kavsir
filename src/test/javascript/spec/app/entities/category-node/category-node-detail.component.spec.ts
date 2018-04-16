/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { KavsirTestModule } from '../../../test.module';
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
                    CategoryNodeService
                ]
            })
            .overrideTemplate(CategoryNodeDetailComponent, '')
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

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new CategoryNode(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.categoryNode).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
