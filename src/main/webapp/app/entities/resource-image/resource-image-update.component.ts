import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IResourceImage, ResourceImage } from 'app/shared/model/resource-image.model';
import { ResourceImageService } from './resource-image.service';
import { IQuestionChoice } from 'app/shared/model/question-choice.model';
import { QuestionChoiceService } from 'app/entities/question-choice';
import { IQuestionChoiceOption } from 'app/shared/model/question-choice-option.model';
import { QuestionChoiceOptionService } from 'app/entities/question-choice-option';
import { IQuestionTrueFalse } from 'app/shared/model/question-true-false.model';
import { QuestionTrueFalseService } from 'app/entities/question-true-false';
import { IQuestionEssay } from 'app/shared/model/question-essay.model';
import { QuestionEssayService } from 'app/entities/question-essay';

@Component({
  selector: 'jhi-resource-image-update',
  templateUrl: './resource-image-update.component.html'
})
export class ResourceImageUpdateComponent implements OnInit {
  resourceImage: IResourceImage;
  isSaving: boolean;

  questionchoices: IQuestionChoice[];

  questionchoiceoptions: IQuestionChoiceOption[];

  questiontruefalses: IQuestionTrueFalse[];

  questionessays: IQuestionEssay[];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    content: [null, [Validators.required]],
    contentContentType: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected resourceImageService: ResourceImageService,
    protected questionChoiceService: QuestionChoiceService,
    protected questionChoiceOptionService: QuestionChoiceOptionService,
    protected questionTrueFalseService: QuestionTrueFalseService,
    protected questionEssayService: QuestionEssayService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ resourceImage }) => {
      this.updateForm(resourceImage);
      this.resourceImage = resourceImage;
    });
    this.questionChoiceService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IQuestionChoice[]>) => mayBeOk.ok),
        map((response: HttpResponse<IQuestionChoice[]>) => response.body)
      )
      .subscribe((res: IQuestionChoice[]) => (this.questionchoices = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.questionChoiceOptionService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IQuestionChoiceOption[]>) => mayBeOk.ok),
        map((response: HttpResponse<IQuestionChoiceOption[]>) => response.body)
      )
      .subscribe(
        (res: IQuestionChoiceOption[]) => (this.questionchoiceoptions = res),
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.questionTrueFalseService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IQuestionTrueFalse[]>) => mayBeOk.ok),
        map((response: HttpResponse<IQuestionTrueFalse[]>) => response.body)
      )
      .subscribe((res: IQuestionTrueFalse[]) => (this.questiontruefalses = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.questionEssayService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IQuestionEssay[]>) => mayBeOk.ok),
        map((response: HttpResponse<IQuestionEssay[]>) => response.body)
      )
      .subscribe((res: IQuestionEssay[]) => (this.questionessays = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(resourceImage: IResourceImage) {
    this.editForm.patchValue({
      id: resourceImage.id,
      name: resourceImage.name,
      content: resourceImage.content,
      contentContentType: resourceImage.contentContentType
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

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null
    });
    if (this.elementRef && idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const resourceImage = this.createFromForm();
    if (resourceImage.id !== undefined) {
      this.subscribeToSaveResponse(this.resourceImageService.update(resourceImage));
    } else {
      this.subscribeToSaveResponse(this.resourceImageService.create(resourceImage));
    }
  }

  private createFromForm(): IResourceImage {
    const entity = {
      ...new ResourceImage(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      contentContentType: this.editForm.get(['contentContentType']).value,
      content: this.editForm.get(['content']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IResourceImage>>) {
    result.subscribe((res: HttpResponse<IResourceImage>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

  trackQuestionChoiceOptionById(index: number, item: IQuestionChoiceOption) {
    return item.id;
  }

  trackQuestionTrueFalseById(index: number, item: IQuestionTrueFalse) {
    return item.id;
  }

  trackQuestionEssayById(index: number, item: IQuestionEssay) {
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
