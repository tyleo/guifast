use libflo_action_std::NumberOrString;

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct BasicActionSerde {
    #[serde(rename = "type")]
    action_type: NumberOrString,
}
