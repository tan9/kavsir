import { BaseEntity } from './../../shared';

export class ResourceImage implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public contentContentType?: string,
        public content?: any,
        public hash?: string,
        public choices?: BaseEntity[],
        public choiceOptions?: BaseEntity[],
        public trueFalses?: BaseEntity[],
        public essays?: BaseEntity[],
    ) {
    }
}
