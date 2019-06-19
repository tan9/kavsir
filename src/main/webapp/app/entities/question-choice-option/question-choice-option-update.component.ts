import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IQuestionChoiceOption, QuestionChoiceOption } from 'app/shared/model/question-choice-option.model';
import { QuestionChoiceOptionService } from './question-choice-option.service';
import { IQuestionChoice } from 'app/shared/model/question-choice.model';
import { QuestionChoiceService } from 'app/entities/question-choice';
import { IResourceImage } from 'app/shared/model/resource-image.model';
import { ResourceImageService } from 'app/entities/resource-image';

@Component({
  selector: 'jhi-question-choice-option-update',
  templateUrl: './question-choice-option-update.component.html'
})
export class QuestionChoiceOptionUpdateComponent implements OnInit {
  isSaving: boolean;

  questionchoices: IQuestionChoice[];

  resourceimages: IResourceImage[];

  editForm = this.fb.group({
    id: [],
    correct: [null, [Validators.required]],
    text: [null, [Validators.required]],
    memo: [],
    questionChoiceId: [],
    images: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected questionChoiceOptionService: QuestionChoiceOptionService,
    protected questionChoiceService: QuestionChoiceService,
    protected resourceImageService: ResourceImageService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ questionChoiceOption }) => {
      this.updateForm(questionChoiceOption);
    });
    this.questionChoiceService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IQuestionChoice[]>) => mayBeOk.ok),
        map((response: HttpResponse<IQuestionChoice[]>) => response.body)
      )
      .subscribe((res: IQuestionChoice[]) => (this.questionchoices = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.resourceImageService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IResourceImage[]>) => mayBeOk.ok),
        map((response: HttpResponse<IResourceImage[]>) => response.body)
      )
      .subscribe((res: IResourceImage[]) => (this.resourceimages = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(questionChoiceOption: IQuestionChoiceOption) {
    this.editForm.patchValue({
      id: questionChoiceOption.id,
      correct: questionChoiceOption.correct,
      text: questionChoiceOption.text,
      memo: questionChoiceOption.memo,
      questionChoiceId: questionChoiceOption.questionChoiceId,
      images: questionChoiceOption.images
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
    const questionChoiceOption = this.createFromForm();
    if (questionChoiceOption.id !== undefined) {
      this.subscribeToSaveResponse(this.questionChoiceOptionService.update(questionChoiceOption));
    } else {
      this.subscribeToSaveResponse(this.questionChoiceOptionService.create(questionChoiceOption));
    }
  }

  private createFromForm(): IQuestionChoiceOption {
    const entity = {
      ...new QuestionChoiceOption(),
      id: this.editForm.get(['id']).value,
      correct: this.editForm.get(['correct']).value,
      text: this.editForm.get(['text']).value,
      memo: this.editForm.get(['memo']).value,
      questionChoiceId: this.editForm.get(['questionChoiceId']).value,
      images: this.editForm.get(['images']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuestionChoiceOption>>) {
    result.subscribe((res: HttpResponse<IQuestionChoiceOption>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

  trackQuestionChoiceById(index: number, item: IQuestionChoice) {
    return item.id;
  }

  trackResourceImageById(index: number, item: IResourceImage) {
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
