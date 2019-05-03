import { IQuestionChoice } from 'app/shared/model/question-choice.model';
import { IQuestionTrueFalse } from 'app/shared/model/question-true-false.model';
import { IQuestionEssay } from 'app/shared/model/question-essay.model';
import { ICategoryNode } from 'app/shared/model/category-node.model';

export interface IQuestionGroup {
  id?: number;
  text?: any;
  memo?: string;
  choices?: IQuestionChoice[];
  trueFalses?: IQuestionTrueFalse[];
  essays?: IQuestionEssay[];
  categories?: ICategoryNode[];
}

export class QuestionGroup implements IQuestionGroup {
  constructor(
    public id?: number,
    public text?: any,
    public memo?: string,
    public choices?: IQuestionChoice[],
    public trueFalses?: IQuestionTrueFalse[],
    public essays?: IQuestionEssay[],
    public categories?: ICategoryNode[]
  ) {}
}
