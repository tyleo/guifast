#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
pub enum ActionLocation {
    Guifast,
    Libflo,
    SharedStore,
    Store(usize)
}
