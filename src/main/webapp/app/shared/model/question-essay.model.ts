import { ICategoryNode } from 'app/shared/model/category-node.model';
import { IResourceImage } from 'app/shared/model/resource-image.model';

export interface IQuestionEssay {
  id?: number;
  text?: any;
  answer?: any;
  memo?: string;
  groupPosition?: number;
  categories?: ICategoryNode[];
  images?: IResourceImage[];
  questionGroupId?: number;
}

export class QuestionEssay implements IQuestionEssay {
  constructor(
    public id?: number,
    public text?: any,
    public answer?: any,
    public memo?: string,
    public groupPosition?: number,
    public categories?: ICategoryNode[],
    public images?: IResourceImage[],
    public questionGroupId?: number
  ) {}
}
