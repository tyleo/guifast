use error::*;
use libflo_std::PathResolver;
use std::fs;

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct RequireInfoSerde {
    name: String,
    path: String,
}

impl RequireInfoSerde {
    pub fn new(name: String, path: String) -> Self {
        RequireInfoSerde { name: name, path: path, }
    }

    pub fn canonicalize(&mut self, module_id: usize, self_module_id: usize, path_resolver: &PathResolver) -> Result<()> {
        let full_path = path_resolver.find_submodule_file_path(&self.path, module_id, self_module_id)?;
        let canonicalized_path = fs::canonicalize(full_path)?;
        self.path = canonicalized_path.to_string_lossy().into_owned();

        Ok(())
    }
}
