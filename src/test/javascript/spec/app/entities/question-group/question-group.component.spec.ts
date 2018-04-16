/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { KavsirTestModule } from '../../../test.module';
import { QuestionGroupComponent } from '../../../../../../main/webapp/app/entities/question-group/question-group.component';
import { QuestionGroupService } from '../../../../../../main/webapp/app/entities/question-group/question-group.service';
import { QuestionGroup } from '../../../../../../main/webapp/app/entities/question-group/question-group.model';

describe('Component Tests', () => {

    describe('QuestionGroup Management Component', () => {
        let comp: QuestionGroupComponent;
        let fixture: ComponentFixture<QuestionGroupComponent>;
        let service: QuestionGroupService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [QuestionGroupComponent],
                providers: [
                    QuestionGroupService
                ]
            })
            .overrideTemplate(QuestionGroupComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionGroupComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionGroupService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new QuestionGroup(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.questionGroups[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
