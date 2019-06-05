/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { QuestionChoiceUpdateComponent } from 'app/entities/question-choice/question-choice-update.component';
import { QuestionChoiceService } from 'app/entities/question-choice/question-choice.service';
import { QuestionChoice } from 'app/shared/model/question-choice.model';

describe('Component Tests', () => {
  describe('QuestionChoice Management Update Component', () => {
    let comp: QuestionChoiceUpdateComponent;
    let fixture: ComponentFixture<QuestionChoiceUpdateComponent>;
    let service: QuestionChoiceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [QuestionChoiceUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(QuestionChoiceUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QuestionChoiceUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(QuestionChoiceService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new QuestionChoice(123);
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
        const entity = new QuestionChoice();
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
