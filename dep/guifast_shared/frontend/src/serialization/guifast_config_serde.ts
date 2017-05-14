export interface GuifastConfigSerde {
    readonly should_log_guifast_input: boolean;
    readonly should_log_guifast_output: boolean;
    readonly should_log_guifast_error: boolean;

    readonly should_log_libflo_input: boolean;
    readonly should_log_libflo_output: boolean;
    readonly should_log_libflo_error: boolean;

    readonly should_log_shared_store_input: boolean;
    readonly should_log_shared_store_output: boolean;
    readonly should_log_shared_store_error: boolean;

    readonly should_log_store_input: boolean;
    readonly should_log_store_output: boolean;
    readonly should_log_store_error: boolean;

    readonly should_always_reconcile_stores: boolean;
}
