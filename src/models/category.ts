import { v4 as uuidv4 } from 'uuid';

export class Category {
    public id: string;

    constructor(
        public name: string = "Sem Categoria",
    ) {
        this.id = uuidv4();
    }
}