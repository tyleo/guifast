use guifast_shared::error::*;
use libflo_std::{ Result as FuncResult };
use libflo_action_std::{ ACTION_MAPPER, impl_construct as impl_action_construct };
use std::any::Any;
use try_init;

#[no_mangle]
pub unsafe extern fn action_construct(arg: &Any) -> FuncResult<()> {
    impl_action_construct(
        arg,
        |arg| -> Result<()> {
            ACTION_MAPPER.set(arg.clone())?;
            try_init()
        }
    )
}
