import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ICategorySemester, CategorySemester } from 'app/shared/model/category-semester.model';
import { CategorySemesterService } from './category-semester.service';

@Component({
  selector: 'jhi-category-semester-update',
  templateUrl: './category-semester-update.component.html'
})
export class CategorySemesterUpdateComponent implements OnInit {
  categorySemester: ICategorySemester;
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    position: [null, [Validators.required]],
    name: [null, [Validators.required]]
  });

  constructor(
    protected categorySemesterService: CategorySemesterService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ categorySemester }) => {
      this.updateForm(categorySemester);
      this.categorySemester = categorySemester;
    });
  }

  updateForm(categorySemester: ICategorySemester) {
    this.editForm.patchValue({
      id: categorySemester.id,
      position: categorySemester.position,
      name: categorySemester.name
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const categorySemester = this.createFromForm();
    if (categorySemester.id !== undefined) {
      this.subscribeToSaveResponse(this.categorySemesterService.update(categorySemester));
    } else {
      this.subscribeToSaveResponse(this.categorySemesterService.create(categorySemester));
    }
  }

  private createFromForm(): ICategorySemester {
    const entity = {
      ...new CategorySemester(),
      id: this.editForm.get(['id']).value,
      position: this.editForm.get(['position']).value,
      name: this.editForm.get(['name']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategorySemester>>) {
    result.subscribe((res: HttpResponse<ICategorySemester>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
