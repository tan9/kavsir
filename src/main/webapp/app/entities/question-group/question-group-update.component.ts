import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IQuestionGroup, QuestionGroup } from 'app/shared/model/question-group.model';
import { QuestionGroupService } from './question-group.service';
import { ICategoryNode } from 'app/shared/model/category-node.model';
import { CategoryNodeService } from 'app/entities/category-node';

@Component({
  selector: 'jhi-question-group-update',
  templateUrl: './question-group-update.component.html'
})
export class QuestionGroupUpdateComponent implements OnInit {
  isSaving: boolean;

  categorynodes: ICategoryNode[];

  editForm = this.fb.group({
    id: [],
    text: [null, [Validators.required]],
    memo: [],
    categories: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected questionGroupService: QuestionGroupService,
    protected categoryNodeService: CategoryNodeService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ questionGroup }) => {
      this.updateForm(questionGroup);
    });
    this.categoryNodeService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ICategoryNode[]>) => mayBeOk.ok),
        map((response: HttpResponse<ICategoryNode[]>) => response.body)
      )
      .subscribe((res: ICategoryNode[]) => (this.categorynodes = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(questionGroup: IQuestionGroup) {
    this.editForm.patchValue({
      id: questionGroup.id,
      text: questionGroup.text,
      memo: questionGroup.memo,
      categories: questionGroup.categories
    });
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, field: string, isImage) {
    return new Promise((resolve, reject) => {
      if (event && event.target && event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        if (isImage && !/^image\//.test(file.type)) {
          reject(`File was expected to be an image but was found to be ${file.type}`);
        } else {
          const filedContentType: string = field + 'ContentType';
          this.dataUtils.toBase64(file, base64Data => {
            this.editForm.patchValue({
              [field]: base64Data,
              [filedContentType]: file.type
            });
          });
        }
      } else {
        reject(`Base64 data was not set as file could not be extracted from passed parameter: ${event}`);
      }
    }).then(
      () => console.log('blob added'), // sucess
      this.onError
    );
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const questionGroup = this.createFromForm();
    if (questionGroup.id !== undefined) {
      this.subscribeToSaveResponse(this.questionGroupService.update(questionGroup));
    } else {
      this.subscribeToSaveResponse(this.questionGroupService.create(questionGroup));
    }
  }

  private createFromForm(): IQuestionGroup {
    const entity = {
      ...new QuestionGroup(),
      id: this.editForm.get(['id']).value,
      text: this.editForm.get(['text']).value,
      memo: this.editForm.get(['memo']).value,
      categories: this.editForm.get(['categories']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuestionGroup>>) {
    result.subscribe((res: HttpResponse<IQuestionGroup>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackCategoryNodeById(index: number, item: ICategoryNode) {
    return item.id;
  }

  getSelected(selectedVals: Array<any>, option: any) {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
