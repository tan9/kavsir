import { BaseEntity } from './../../shared';

export class QuestionChoiceOption implements BaseEntity {
    constructor(
        public id?: number,
        public correct?: boolean,
        public text?: string,
        public memo?: string,
        public questionChoiceId?: number,
        public images?: BaseEntity[],
    ) {
        this.correct = false;
        this.images = [];
    }
}
