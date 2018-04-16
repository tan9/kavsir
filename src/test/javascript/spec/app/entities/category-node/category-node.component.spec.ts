/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { KavsirTestModule } from '../../../test.module';
import { CategoryNodeComponent } from '../../../../../../main/webapp/app/entities/category-node/category-node.component';
import { CategoryNodeService } from '../../../../../../main/webapp/app/entities/category-node/category-node.service';
import { CategoryNode } from '../../../../../../main/webapp/app/entities/category-node/category-node.model';

describe('Component Tests', () => {

    describe('CategoryNode Management Component', () => {
        let comp: CategoryNodeComponent;
        let fixture: ComponentFixture<CategoryNodeComponent>;
        let service: CategoryNodeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [CategoryNodeComponent],
                providers: [
                    CategoryNodeService
                ]
            })
            .overrideTemplate(CategoryNodeComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategoryNodeComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategoryNodeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new CategoryNode(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.categoryNodes[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
