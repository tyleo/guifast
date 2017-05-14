use { serde_json };
use error::*;
use libflo_action_std::Action;
use libflo_std::LIBFLO;
use serde::Serialize;

pub unsafe fn send_to_guifast<T>(action: &T) -> Result<()>
    where T: Action + Serialize {
    let message = serde_json::to_string(&action)?;
    let libflo = LIBFLO.read()?;
    libflo.sendln(&message)?;
    Ok(())
}
