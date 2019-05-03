import { IQuestionChoiceOption } from 'app/shared/model/question-choice-option.model';
import { ICategoryNode } from 'app/shared/model/category-node.model';
import { IResourceImage } from 'app/shared/model/resource-image.model';

export interface IQuestionChoice {
  id?: number;
  multipleResponse?: boolean;
  text?: any;
  memo?: string;
  groupPosition?: number;
  options?: IQuestionChoiceOption[];
  categories?: ICategoryNode[];
  images?: IResourceImage[];
  questionGroupId?: number;
}

export class QuestionChoice implements IQuestionChoice {
  constructor(
    public id?: number,
    public multipleResponse?: boolean,
    public text?: any,
    public memo?: string,
    public groupPosition?: number,
    public options?: IQuestionChoiceOption[],
    public categories?: ICategoryNode[],
    public images?: IResourceImage[],
    public questionGroupId?: number
  ) {
    this.multipleResponse = this.multipleResponse || false;
  }
}
