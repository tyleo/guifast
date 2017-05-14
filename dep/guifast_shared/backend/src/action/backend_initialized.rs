use libflo_action_std::{ Action, ActionMapperSerde, action_str_id, NumberOrString };
use libflo_std::ModuleMapperSerde;
use serialization::{ GuifastConfigSerde, ModulesSerde };
use string;

#[derive(Clone, Debug, Serialize)]
pub struct BackendInitialized<'a, 'b, 'c, 'd, 'e> {
    #[serde(rename = "type")]
    action_type: NumberOrString,
    action_mapper: ActionMapperSerde<'a, 'b>,
    config: &'c GuifastConfigSerde,
    module_mapper: ModuleMapperSerde<'d, 'e>,
    modules: ModulesSerde,
}

impl <'a, 'b, 'c, 'd, 'e> BackendInitialized<'a, 'b, 'c, 'd, 'e> {
    pub fn new(action_mapper: ActionMapperSerde<'a, 'b>, config: &'c GuifastConfigSerde, module_mapper: ModuleMapperSerde<'d, 'e>, modules: ModulesSerde) -> Self {
        BackendInitialized {
            action_type: action_str_id(string::module(), string::backend_initialized_action()),
            action_mapper: action_mapper,
            config: config,
            module_mapper: module_mapper,
            modules: modules,
        }
    }
}

impl <'a, 'b, 'c, 'd, 'e> Action for BackendInitialized<'a, 'b, 'c, 'd, 'e> {
    fn get_type(&self) -> &NumberOrString {
        &self.action_type
    }
}
