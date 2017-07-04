import { BaseEntity } from './../../shared';

export class QuestionChoiceOption implements BaseEntity {
    constructor(
        public id?: number,
        public correct?: boolean,
        public text?: any,
        public memo?: string,
        public questionChoiceId?: number,
        public images?: BaseEntity[],
    ) {
        this.correct = false;
    }
}
