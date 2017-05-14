#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct GuifastConfigSerde {
    pub should_always_reconcile_stores: bool,
}
