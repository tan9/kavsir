import { ICategoryNode } from 'app/shared/model/category-node.model';
import { IResourceImage } from 'app/shared/model/resource-image.model';

export interface IQuestionTrueFalse {
  id?: number;
  correct?: boolean;
  text?: any;
  memo?: string;
  groupPosition?: number;
  categories?: ICategoryNode[];
  images?: IResourceImage[];
  questionGroupId?: number;
}

export class QuestionTrueFalse implements IQuestionTrueFalse {
  constructor(
    public id?: number,
    public correct?: boolean,
    public text?: any,
    public memo?: string,
    public groupPosition?: number,
    public categories?: ICategoryNode[],
    public images?: IResourceImage[],
    public questionGroupId?: number
  ) {
    this.correct = this.correct || false;
  }
}
