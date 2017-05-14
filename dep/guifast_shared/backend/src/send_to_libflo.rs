use error::*;
use libflo_action_std::{ AnyAction, dispatch };
use libflo_std::LIBFLO;

pub unsafe fn send_to_libflo<T>(action: &T) -> Result<()>
    where T: AnyAction {
    let libflo = LIBFLO.read()?;
    Ok(dispatch(&libflo, action)?)
}
