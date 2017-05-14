use { send_to_guifast };
use action::ForwardAction;
use error::*;
use libflo_action_std::Action;
use serde::Serialize;
use serialization::ActionLocation;

pub unsafe fn send_to_store<T>(action: &T, id: usize) -> Result<()>
    where T: Action + Serialize {
    let action = ForwardAction::new(action, ActionLocation::Store(id));
    send_to_guifast(&action)
}
