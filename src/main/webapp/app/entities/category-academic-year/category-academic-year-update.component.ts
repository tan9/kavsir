import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ICategoryAcademicYear, CategoryAcademicYear } from 'app/shared/model/category-academic-year.model';
import { CategoryAcademicYearService } from './category-academic-year.service';

@Component({
  selector: 'jhi-category-academic-year-update',
  templateUrl: './category-academic-year-update.component.html'
})
export class CategoryAcademicYearUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    position: [null, [Validators.required]],
    name: [null, [Validators.required]]
  });

  constructor(
    protected categoryAcademicYearService: CategoryAcademicYearService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ categoryAcademicYear }) => {
      this.updateForm(categoryAcademicYear);
    });
  }

  updateForm(categoryAcademicYear: ICategoryAcademicYear) {
    this.editForm.patchValue({
      id: categoryAcademicYear.id,
      position: categoryAcademicYear.position,
      name: categoryAcademicYear.name
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const categoryAcademicYear = this.createFromForm();
    if (categoryAcademicYear.id !== undefined) {
      this.subscribeToSaveResponse(this.categoryAcademicYearService.update(categoryAcademicYear));
    } else {
      this.subscribeToSaveResponse(this.categoryAcademicYearService.create(categoryAcademicYear));
    }
  }

  private createFromForm(): ICategoryAcademicYear {
    const entity = {
      ...new CategoryAcademicYear(),
      id: this.editForm.get(['id']).value,
      position: this.editForm.get(['position']).value,
      name: this.editForm.get(['name']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategoryAcademicYear>>) {
    result.subscribe((res: HttpResponse<ICategoryAcademicYear>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
