import React, { useState } from "react";
import { PropsWithChildren, useContext } from "react";

type ErrorContextProps = {
    warningMessage?: string;
    errorMessage?: string;
    resetError: () => void;
    addError: (errorMessage: string) => void;
    addWarning: (warningMessage: string) => void;
};
export const useErrorContext = () => {
    const context = useContext(ErrorContext);
    if (context === undefined) {
        throw new Error("useErrorContext must be used within a ErrorProvider");
    }
    return context;
};
export const ErrorContext = React.createContext<ErrorContextProps>({} as ErrorContextProps);

export default function ErrorProvider({ children }: PropsWithChildren<unknown>) {
    const [errorMessage, setErrorMessage] = useState<string>();
    const [warningMessage, setWarningMessage] = useState<string>();

    const resetError = () => {
        setErrorMessage(undefined);
        setWarningMessage(undefined);
    };
    const addError = (errorMessage: string) => setErrorMessage(errorMessage);
    const addWarning = (warningMessage: string) => setWarningMessage(warningMessage);

    return (
        <ErrorContext.Provider
            value={{
                resetError,
                addError,
                addWarning,
                errorMessage,
                warningMessage,
            }}
        >
            {children}
        </ErrorContext.Provider>
    );
}
