/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { KavsirTestModule } from '../../../test.module';
import { QuestionGroupDetailComponent } from '../../../../../../main/webapp/app/entities/question-group/question-group-detail.component';
import { QuestionGroupService } from '../../../../../../main/webapp/app/entities/question-group/question-group.service';
import { QuestionGroup } from '../../../../../../main/webapp/app/entities/question-group/question-group.model';

describe('Component Tests', () => {

    describe('QuestionGroup Management Detail Component', () => {
        let comp: QuestionGroupDetailComponent;
        let fixture: ComponentFixture<QuestionGroupDetailComponent>;
        let service: QuestionGroupService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [QuestionGroupDetailComponent],
                providers: [
                    QuestionGroupService
                ]
            })
            .overrideTemplate(QuestionGroupDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionGroupDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionGroupService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new QuestionGroup(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.questionGroup).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
