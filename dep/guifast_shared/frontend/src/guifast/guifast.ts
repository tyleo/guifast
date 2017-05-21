import * as GuifastImport from "guifast_shared";

export class Guifast {
    private readonly actionMapperField: GuifastImport.ActionMapper;
    private readonly moduleMapperField: GuifastImport.ModuleMapper;

    public constructor(actionMapper: GuifastImport.ActionMapper, moduleMapper: GuifastImport.ModuleMapper) {
        this.actionMapperField = actionMapper;
        this.moduleMapperField = moduleMapper;
    }

    public get actionMapper(): GuifastImport.ExtActionMapper {
        return new GuifastImport.ExtActionMapper(this.actionMapperField, this.moduleMapperField);
    }

    public get moduleMapper(): GuifastImport.ModuleMapper {
        return this.moduleMapperField;
    }
}
