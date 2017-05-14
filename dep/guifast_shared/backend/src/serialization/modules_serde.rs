use serialization::ModuleSerde;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct ModulesSerde {
    modules: Vec<ModuleSerde>,
}

impl ModulesSerde {
    pub fn new(modules: Vec<ModuleSerde>) -> Self {
        ModulesSerde { modules: modules, }
    }
}
