use libflo_action_std::{ Action, action_str_id, NumberOrString };
use serde::Serialize;
use serialization::ActionLocation;
use string;

#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
pub struct ForwardAction<'a, T>
    where T: Action + Serialize + 'a {
    #[serde(rename = "type")]
    action_type: NumberOrString,
    action: &'a T,
    destination: ActionLocation,
}

impl <'a, T> ForwardAction<'a, T>
    where T: Action + Serialize + 'a {
    pub fn new(action: &'a T, destination: ActionLocation) -> Self {
        ForwardAction {
            action_type: action_str_id(string::module(), string::forward_action()),
            action: action,
            destination: destination
        }
    }
}

impl <'a, T> Action for ForwardAction<'a, T>
    where T: Action + Serialize + 'a {
    fn get_type(&self) -> &NumberOrString {
        &self.action_type
    }
}
