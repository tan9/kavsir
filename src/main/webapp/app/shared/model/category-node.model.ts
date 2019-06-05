import { IQuestionTrueFalse } from 'app/shared/model/question-true-false.model';
import { IQuestionChoice } from 'app/shared/model/question-choice.model';
import { IQuestionEssay } from 'app/shared/model/question-essay.model';
import { IQuestionGroup } from 'app/shared/model/question-group.model';

export const enum CategoryType {
  ACADEMIC_YEAR = 'ACADEMIC_YEAR',
  GRADE = 'GRADE',
  SEMESTER = 'SEMESTER',
  SUBJECT = 'SUBJECT',
  SOURCE = 'SOURCE',
  SEGMENT = 'SEGMENT'
}

export interface ICategoryNode {
  id?: number;
  type?: CategoryType;
  typeId?: number;
  name?: string;
  position?: number;
  parentId?: number;
  trueOrFalses?: IQuestionTrueFalse[];
  choices?: IQuestionChoice[];
  essays?: IQuestionEssay[];
  groups?: IQuestionGroup[];
}

export class CategoryNode implements ICategoryNode {
  constructor(
    public id?: number,
    public type?: CategoryType,
    public typeId?: number,
    public name?: string,
    public position?: number,
    public parentId?: number,
    public trueOrFalses?: IQuestionTrueFalse[],
    public choices?: IQuestionChoice[],
    public essays?: IQuestionEssay[],
    public groups?: IQuestionGroup[]
  ) {}
}
