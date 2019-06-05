/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { QuestionTrueFalseUpdateComponent } from 'app/entities/question-true-false/question-true-false-update.component';
import { QuestionTrueFalseService } from 'app/entities/question-true-false/question-true-false.service';
import { QuestionTrueFalse } from 'app/shared/model/question-true-false.model';

describe('Component Tests', () => {
  describe('QuestionTrueFalse Management Update Component', () => {
    let comp: QuestionTrueFalseUpdateComponent;
    let fixture: ComponentFixture<QuestionTrueFalseUpdateComponent>;
    let service: QuestionTrueFalseService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [QuestionTrueFalseUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(QuestionTrueFalseUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QuestionTrueFalseUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(QuestionTrueFalseService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new QuestionTrueFalse(123);
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
        const entity = new QuestionTrueFalse();
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
