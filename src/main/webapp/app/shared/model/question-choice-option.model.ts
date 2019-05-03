import { IResourceImage } from 'app/shared/model/resource-image.model';

export interface IQuestionChoiceOption {
  id?: number;
  correct?: boolean;
  text?: any;
  memo?: string;
  questionChoiceId?: number;
  images?: IResourceImage[];
}

export class QuestionChoiceOption implements IQuestionChoiceOption {
  constructor(
    public id?: number,
    public correct?: boolean,
    public text?: any,
    public memo?: string,
    public questionChoiceId?: number,
    public images?: IResourceImage[]
  ) {
    this.correct = this.correct || false;
  }
}
