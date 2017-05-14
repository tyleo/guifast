use libflo_action_std::{ ACTION_MAPPER, impl_parse, PARSE_MAP };
use libflo_std::{ LIBFLO, Result as FuncResult };
use std::any::Any;

#[no_mangle]
pub extern fn parse(arg: &Any) -> FuncResult<Box<Any>> {
    impl_parse(
        arg,
        |arg| {
            let parser = PARSE_MAP.read().unwrap();
            let libflo = LIBFLO.read().unwrap();
            let module_mapper = libflo.get_module_mapper();
            let action_mapper = ACTION_MAPPER.read().unwrap();
            parser.parse(arg, module_mapper, &action_mapper)
        }
    )
}
