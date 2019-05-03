import { IQuestionChoice } from 'app/shared/model/question-choice.model';
import { IQuestionChoiceOption } from 'app/shared/model/question-choice-option.model';
import { IQuestionTrueFalse } from 'app/shared/model/question-true-false.model';
import { IQuestionEssay } from 'app/shared/model/question-essay.model';

export interface IResourceImage {
  id?: number;
  name?: string;
  contentContentType?: string;
  content?: any;
  choices?: IQuestionChoice[];
  choiceOptions?: IQuestionChoiceOption[];
  trueFalses?: IQuestionTrueFalse[];
  essays?: IQuestionEssay[];
}

export class ResourceImage implements IResourceImage {
  constructor(
    public id?: number,
    public name?: string,
    public contentContentType?: string,
    public content?: any,
    public choices?: IQuestionChoice[],
    public choiceOptions?: IQuestionChoiceOption[],
    public trueFalses?: IQuestionTrueFalse[],
    public essays?: IQuestionEssay[]
  ) {}
}
