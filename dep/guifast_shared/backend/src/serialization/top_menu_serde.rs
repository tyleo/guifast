use serialization::BasicActionSerde;

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct TopMenuSerde {
    pub action: Option<BasicActionSerde>,
    pub label: String,
    pub submenu: Option<Vec<TopMenuSerde>>
}