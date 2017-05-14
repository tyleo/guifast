use error::*;
use libflo_std::PathResolver;
use serialization::{ ComponentInfoSerde, RequireInfoSerde, TopMenuSerde };

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct FileModuleSerde {
    pub components: Vec<ComponentInfoSerde>,
    pub menu: Option<Vec<TopMenuSerde>>,
    pub main_reducer: Option<RequireInfoSerde>,
    pub renderer_reducer: Option<RequireInfoSerde>,
    pub startup_windows: Option<Vec<String>>
}

impl FileModuleSerde {
    pub fn canonicalize(&mut self, module_name: &str, module_id: usize, self_module_id: usize, path_resolver: &PathResolver) -> Result<()> {
        for component in &mut self.components {
            component.canonicalize(module_name, module_id, self_module_id, path_resolver)?;
        }

        if let Some(ref mut reducer) = self.main_reducer {
            reducer.canonicalize(module_id, self_module_id, path_resolver)?;
        }

        if let Some(ref mut reducer) = self.renderer_reducer {
            reducer.canonicalize(module_id, self_module_id, path_resolver)?;
        }

        Ok(())
    }

    pub fn destructure(self) -> (
        Vec<ComponentInfoSerde>,
        Option<Vec<TopMenuSerde>>,
        Option<RequireInfoSerde>,
        Option<RequireInfoSerde>,
        Option<Vec<String>>
    ) {
        (
            self.components,
            self.menu,
            self.main_reducer,
            self.renderer_reducer,
            self.startup_windows
        )
    }
}
