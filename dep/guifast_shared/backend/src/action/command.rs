use libflo_action_std::{ Action, NumberOrString };

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct Command {
    #[serde(rename = "type")]
    action_type: NumberOrString,
    data: String
}

impl Action for Command {
    fn get_type(&self) -> &NumberOrString {
        &self.action_type
    }
}
