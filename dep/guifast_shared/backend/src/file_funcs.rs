use error::*;
use libflo_std::{ file_from_path, text_from_file };
use serde_json;
use serialization::{ FileModuleSerde, GuifastConfigSerde };
use std::path::Path;

pub fn config_from_path<TPath>(path: TPath) -> Result<GuifastConfigSerde>
    where TPath: AsRef<Path> {
    let file = file_from_path(path)?;
    let text = text_from_file(file)?;
    config_from_text(text)
}

pub fn config_from_text(text: String) -> Result<GuifastConfigSerde> {
    serde_json::from_str::<GuifastConfigSerde>(&text)
        .map_err(|err| Error::from(ErrorKind::SerdeJsonError(err)))
        .chain_err(|| ErrorKind::ConfigDeserializationFailure(text))
}

pub fn module_from_path<TPath>(path: TPath) -> Result<FileModuleSerde>
    where TPath: AsRef<Path> {
    let file = file_from_path(path)?;
    let text = text_from_file(file)?;
    module_from_text(text)
}

pub fn module_from_text(text: String) -> Result<FileModuleSerde> {
    serde_json::from_str::<FileModuleSerde>(&text)
        .map_err(|err| Error::from(ErrorKind::SerdeJsonError(err)))
        .chain_err(|| ErrorKind::ModuleDeserializationFailure(text))
}
