import { ActionMapper, ExtActionMapper, ModuleMapper } from "guifast_shared";

export class Guifast {
    private readonly actionMapperField: ActionMapper;
    private readonly moduleMapperField: ModuleMapper;

    public constructor(actionMapper: ActionMapper, moduleMapper: ModuleMapper) {
        this.actionMapperField = actionMapper;
        this.moduleMapperField = moduleMapper;
    }

    public get actionMapper(): ExtActionMapper {
        return new ExtActionMapper(this.actionMapperField, this.moduleMapperField);
    }

    public get moduleMapper(): ModuleMapper {
        return this.moduleMapperField;
    }
}
