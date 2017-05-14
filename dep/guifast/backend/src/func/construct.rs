use guifast_shared::error::*;
use libflo_std::{ impl_construct, LIBFLO, Result as FuncResult };
use std::any::Any;
use try_init;

#[no_mangle]
pub unsafe extern fn construct(arg: &Any) -> FuncResult<()> {
    impl_construct(
        arg,
        |arg| -> Result<()> {
            LIBFLO.set(arg.clone())?;
            try_init()
        }
    )
}
