#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
pub enum ActionLocation {
    Libflo,
    SharedRenderer,
    Renderer(usize)
}
