import {FieldDef} from "./FieldDef";
export class Individual {

    private fieldsMap:{ [key:string]:any; } = {};
    private fieldsDefMap:{ [key:string]:FieldDef} = {};

    getValue(name:string) {
        return this.fieldsMap[name];
    }

    getFieldDefinition(name:string):FieldDef {
        return this.fieldsDefMap[name];
    }

    setValue(name:string, value:any) {
        this.fieldsMap[name] = this.fieldsDefMap[name].filter(value);
    }

    registerField(field:FieldDef) {
        this.fieldsMap[field.name] = field.getInitialValue();
        this.fieldsDefMap[field.name] = field;
    }

}

