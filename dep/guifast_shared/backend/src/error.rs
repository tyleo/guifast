use libflo_action_std;
use libflo_std::{ event, libflo, module, mut_static };
use serde_json;
use std::io;

error_chain! {
    types { }

    links {
        LibfloActionError(libflo_action_std::Error, libflo_action_std::ErrorKind);
        LibfloError(libflo::Error, libflo::ErrorKind);
        LibfloModuleError(module::Error, module::ErrorKind);
        LibfloEventError(event::Error, event::ErrorKind);
        MutStaticError(mut_static::Error, mut_static::ErrorKind);
    }

    foreign_links {
        IoError(io::Error);
        SerdeJsonError(serde_json::Error);
    }

    errors {
        ConfigDeserializationFailure(config_text: String) {
            description("Error deserializing config text. The config text could not be deserialized.")
            display(
                "{}{}{}",
                "Error deserializing config text:\n",
                config_text,
                "\nThe config text could not be deserialized.",
            )
        }

        DowncastFailure(expected_type: String) {
            description("Failed to cast into the expected type.")
            display(
                "{}{}{}",
                "Failed to cast into the expected type, '",
                expected_type,
                "'."
            )
        }

        ModuleDeserializationFailure(guifast_text: String) {
            description("Error deserializing guifast text. The guifast text could not be deserialized.")
            display(
                "{}{}{}",
                "Error deserializing guifast text:\n",
                guifast_text,
                "\nThe guifast text could not be deserialized.",
            )
        }

        NumberCannotNotBeConvertedIntoActionType(number: usize) {
            description("The number could not be converted into an action type.")
            display(
                "{}{}{}",
                "The number, '",
                number,
                "', could not be converted into an action type."
            )
        }
    }
}
