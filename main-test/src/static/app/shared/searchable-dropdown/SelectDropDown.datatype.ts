export class SelectDropDown {
    constructor(id?: string, description?: string) {
        this.id = id ? id : null;
        this.description = description ? id : null;
    }

    id: string;
    description: string;
}
