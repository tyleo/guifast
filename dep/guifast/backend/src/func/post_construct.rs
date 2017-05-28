use { guifast_shared };
use guifast_shared::action::LibfloInitialized;
use guifast_shared::CONFIG;
use guifast_shared::error::*;
use guifast_shared::file_funcs;
use guifast_shared::serialization::{ ModuleSerde, ModulesSerde };
use guifast_shared::string;
use libflo_action_std::ACTION_MAPPER;
use libflo_std::{ LIBFLO, impl_post_construct, Result as FuncResult };

#[no_mangle]
pub unsafe extern fn post_construct() -> FuncResult<()> {
    impl_post_construct(
        || -> Result<()> {
            let action_mapper = ACTION_MAPPER.read()?;
            let libflo = LIBFLO.read()?;

            // Build the guifast serde
            let module_mapper = libflo.get_module_mapper();
            let module_map = module_mapper.get_raw_map();
            let path_resolver = libflo.get_path_resolver();

            let config_serde = file_funcs::config_from_path(string::guifast_config_file())?;
            CONFIG.set(config_serde.clone())?;

            let self_module_id = module_mapper.get(string::module())?;

            let mut result_guifast_modules = Vec::new();
            for (module_name, module_id) in module_map {
                if path_resolver.has_submodule(*module_id, self_module_id)? {
                    let guifast_file = path_resolver.find_submodule_file_path(string::guifast_file(), *module_id, self_module_id)?;
                    let mut file_module_serde = file_funcs::module_from_path(guifast_file)?;
                    file_module_serde.canonicalize(module_name, *module_id, self_module_id, &path_resolver)?;
                    let (components, menu, main_reducer, renderer_reducer, startup_windows) = file_module_serde.destructure();
                    let module_serde = ModuleSerde::new(components, menu, module_name.clone(), main_reducer, renderer_reducer, startup_windows);

                    result_guifast_modules.push(module_serde);
                }
            }
            let guifast_serde = ModulesSerde::new(result_guifast_modules);

            let backend_initialized = LibfloInitialized::new(action_mapper.make_serde(), &config_serde, module_mapper.make_serde(), guifast_serde);
            guifast_shared::send_to_guifast(&backend_initialized)?;
            Ok(())
        }
    )
}
