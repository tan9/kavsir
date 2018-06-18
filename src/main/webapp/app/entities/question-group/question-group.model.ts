import { BaseEntity } from './../../shared';

export class QuestionGroup implements BaseEntity {
    constructor(
        public id?: number,
        public text?: any,
        public memo?: string,
        public choices?: BaseEntity[],
        public trueFalses?: BaseEntity[],
        public essays?: BaseEntity[],
        public categories?: BaseEntity[],
    ) {
    }
}
