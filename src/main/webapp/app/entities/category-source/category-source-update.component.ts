import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ICategorySource, CategorySource } from 'app/shared/model/category-source.model';
import { CategorySourceService } from './category-source.service';

@Component({
  selector: 'jhi-category-source-update',
  templateUrl: './category-source-update.component.html'
})
export class CategorySourceUpdateComponent implements OnInit {
  categorySource: ICategorySource;
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    position: [null, [Validators.required]],
    name: [null, [Validators.required]]
  });

  constructor(protected categorySourceService: CategorySourceService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ categorySource }) => {
      this.updateForm(categorySource);
      this.categorySource = categorySource;
    });
  }

  updateForm(categorySource: ICategorySource) {
    this.editForm.patchValue({
      id: categorySource.id,
      position: categorySource.position,
      name: categorySource.name
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const categorySource = this.createFromForm();
    if (categorySource.id !== undefined) {
      this.subscribeToSaveResponse(this.categorySourceService.update(categorySource));
    } else {
      this.subscribeToSaveResponse(this.categorySourceService.create(categorySource));
    }
  }

  private createFromForm(): ICategorySource {
    const entity = {
      ...new CategorySource(),
      id: this.editForm.get(['id']).value,
      position: this.editForm.get(['position']).value,
      name: this.editForm.get(['name']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategorySource>>) {
    result.subscribe((res: HttpResponse<ICategorySource>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
