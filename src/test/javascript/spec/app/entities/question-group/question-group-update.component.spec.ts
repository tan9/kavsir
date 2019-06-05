/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { QuestionGroupUpdateComponent } from 'app/entities/question-group/question-group-update.component';
import { QuestionGroupService } from 'app/entities/question-group/question-group.service';
import { QuestionGroup } from 'app/shared/model/question-group.model';

describe('Component Tests', () => {
  describe('QuestionGroup Management Update Component', () => {
    let comp: QuestionGroupUpdateComponent;
    let fixture: ComponentFixture<QuestionGroupUpdateComponent>;
    let service: QuestionGroupService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [QuestionGroupUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(QuestionGroupUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QuestionGroupUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(QuestionGroupService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new QuestionGroup(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new QuestionGroup();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
