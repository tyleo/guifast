use serialization::{ ComponentInfoSerde, RequireInfoSerde, TopMenuSerde };

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct ModuleSerde {
    pub components: Vec<ComponentInfoSerde>,
    pub menu: Option<Vec<TopMenuSerde>>,
    pub name: String,
    pub main_reducer: Option<RequireInfoSerde>,
    pub renderer_reducer: Option<RequireInfoSerde>,
    pub startup_windows: Option<Vec<String>>
}

impl ModuleSerde {
    pub fn new(
        components: Vec<ComponentInfoSerde>,
        menu: Option<Vec<TopMenuSerde>>,
        name: String,
        main_reducer: Option<RequireInfoSerde>,
        renderer_reducer: Option<RequireInfoSerde>,
        startup_windows: Option<Vec<String>>
    ) -> Self {
        ModuleSerde {
            components: components,
            menu: menu,
            name: name,
            main_reducer: main_reducer,
            renderer_reducer: renderer_reducer,
            startup_windows: startup_windows
        }
    }
}
