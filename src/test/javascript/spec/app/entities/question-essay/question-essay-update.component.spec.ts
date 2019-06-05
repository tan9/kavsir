/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { QuestionEssayUpdateComponent } from 'app/entities/question-essay/question-essay-update.component';
import { QuestionEssayService } from 'app/entities/question-essay/question-essay.service';
import { QuestionEssay } from 'app/shared/model/question-essay.model';

describe('Component Tests', () => {
  describe('QuestionEssay Management Update Component', () => {
    let comp: QuestionEssayUpdateComponent;
    let fixture: ComponentFixture<QuestionEssayUpdateComponent>;
    let service: QuestionEssayService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [QuestionEssayUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(QuestionEssayUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QuestionEssayUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(QuestionEssayService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new QuestionEssay(123);
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
        const entity = new QuestionEssay();
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
