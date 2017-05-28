use { send_to_guifast };
use action::ForwardAction;
use error::*;
use libflo_action_std::Action;
use serde::Serialize;
use serialization::ActionLocation;

pub unsafe fn send_to_shared_store<T>(action: &T) -> Result<()>
    where T: Action + Serialize {
    let action = ForwardAction::new(action, ActionLocation::SharedRenderer);
    send_to_guifast(&action)
}
