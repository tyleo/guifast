use error::*;
use libflo_std::PathResolver;
use serialization::RequireInfoSerde;

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct ComponentInfoSerde {
    require_info: RequireInfoSerde,
    name: String
}

impl ComponentInfoSerde {
    pub fn canonicalize(&mut self, module_name: &str, module_id: usize, self_module_id: usize, path_resolver: &PathResolver) -> Result<()> {
        self.name = format!("{} {}", module_name, self.name);
        self.require_info.canonicalize(module_id, self_module_id, path_resolver)
    }
}
