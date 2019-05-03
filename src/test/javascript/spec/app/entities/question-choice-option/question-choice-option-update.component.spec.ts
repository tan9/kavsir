/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { QuestionChoiceOptionUpdateComponent } from 'app/entities/question-choice-option/question-choice-option-update.component';
import { QuestionChoiceOptionService } from 'app/entities/question-choice-option/question-choice-option.service';
import { QuestionChoiceOption } from 'app/shared/model/question-choice-option.model';

describe('Component Tests', () => {
  describe('QuestionChoiceOption Management Update Component', () => {
    let comp: QuestionChoiceOptionUpdateComponent;
    let fixture: ComponentFixture<QuestionChoiceOptionUpdateComponent>;
    let service: QuestionChoiceOptionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [QuestionChoiceOptionUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(QuestionChoiceOptionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QuestionChoiceOptionUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(QuestionChoiceOptionService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new QuestionChoiceOption(123);
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
        const entity = new QuestionChoiceOption();
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
