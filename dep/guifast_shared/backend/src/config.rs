use libflo_std::MutStatic;
use serialization::GuifastConfigSerde;

lazy_static! {
    pub static ref CONFIG: MutStatic<GuifastConfigSerde> = {
        MutStatic::new()
    };
}
