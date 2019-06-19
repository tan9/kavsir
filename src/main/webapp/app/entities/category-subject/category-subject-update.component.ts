import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ICategorySubject, CategorySubject } from 'app/shared/model/category-subject.model';
import { CategorySubjectService } from './category-subject.service';

@Component({
  selector: 'jhi-category-subject-update',
  templateUrl: './category-subject-update.component.html'
})
export class CategorySubjectUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    position: [null, [Validators.required]],
    name: [null, [Validators.required]]
  });

  constructor(
    protected categorySubjectService: CategorySubjectService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ categorySubject }) => {
      this.updateForm(categorySubject);
    });
  }

  updateForm(categorySubject: ICategorySubject) {
    this.editForm.patchValue({
      id: categorySubject.id,
      position: categorySubject.position,
      name: categorySubject.name
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const categorySubject = this.createFromForm();
    if (categorySubject.id !== undefined) {
      this.subscribeToSaveResponse(this.categorySubjectService.update(categorySubject));
    } else {
      this.subscribeToSaveResponse(this.categorySubjectService.create(categorySubject));
    }
  }

  private createFromForm(): ICategorySubject {
    const entity = {
      ...new CategorySubject(),
      id: this.editForm.get(['id']).value,
      position: this.editForm.get(['position']).value,
      name: this.editForm.get(['name']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategorySubject>>) {
    result.subscribe((res: HttpResponse<ICategorySubject>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
