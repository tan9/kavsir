import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ICategoryGrade, CategoryGrade } from 'app/shared/model/category-grade.model';
import { CategoryGradeService } from './category-grade.service';

@Component({
  selector: 'jhi-category-grade-update',
  templateUrl: './category-grade-update.component.html'
})
export class CategoryGradeUpdateComponent implements OnInit {
  categoryGrade: ICategoryGrade;
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    position: [null, [Validators.required]],
    name: [null, [Validators.required]]
  });

  constructor(protected categoryGradeService: CategoryGradeService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ categoryGrade }) => {
      this.updateForm(categoryGrade);
      this.categoryGrade = categoryGrade;
    });
  }

  updateForm(categoryGrade: ICategoryGrade) {
    this.editForm.patchValue({
      id: categoryGrade.id,
      position: categoryGrade.position,
      name: categoryGrade.name
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const categoryGrade = this.createFromForm();
    if (categoryGrade.id !== undefined) {
      this.subscribeToSaveResponse(this.categoryGradeService.update(categoryGrade));
    } else {
      this.subscribeToSaveResponse(this.categoryGradeService.create(categoryGrade));
    }
  }

  private createFromForm(): ICategoryGrade {
    const entity = {
      ...new CategoryGrade(),
      id: this.editForm.get(['id']).value,
      position: this.editForm.get(['position']).value,
      name: this.editForm.get(['name']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategoryGrade>>) {
    result.subscribe((res: HttpResponse<ICategoryGrade>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
