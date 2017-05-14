use guifast_shared::action::Command;
use guifast_shared::error::*;
use guifast_shared::string;
use libflo_action_std::{ ACTION_MAPPER, parse_fn, ParseMap, PARSE_MAP };
use libflo_std::LIBFLO;
use serde_json;

pub unsafe fn try_init() -> Result<()> {
    if ACTION_MAPPER.is_set()? && LIBFLO.is_set()? {
        let action_mapper = ACTION_MAPPER.read()?;
        let libflo = LIBFLO.read()?;
        let module_mapper = libflo.get_module_mapper();

        // Set up parser
        let command_parser = parse_fn(|arg| serde_json::from_str::<Command>(arg));

        let parser = ParseMap::new(
            module_mapper,
            &action_mapper,
            vec![(string::module(), string::command(), command_parser)]
        )?;

        PARSE_MAP.set(parser)?;
    }

    Ok(())
}
