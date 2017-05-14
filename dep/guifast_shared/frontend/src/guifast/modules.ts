import { Module, ModulesSerde } from "guifast_shared";

export class Modules {
    public readonly modules: Array<Module> = [];

    public constructor(modulesSerde: ModulesSerde) {
        let index = 0;
        for (const module of modulesSerde.modules) {
            this.modules.push({
                components: module.components.map(
                    component => {
                        return {
                            requireInfo: {
                                name: component.require_info.name,
                                path: component.require_info.path
                            },
                            name: component.name
                        };
                    }
                ),
                name: module.name,
                mainReducer: module.main_reducer === null ? undefined : { name: module.main_reducer.name, path: module.main_reducer.path },
                rendererReducer: module.renderer_reducer === null ? undefined : { name: module.renderer_reducer.name, path: module.renderer_reducer.path },
                startupWindows: module.startup_windows
            });
            index++;
        }
    }
}
