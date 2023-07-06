import React, { useState } from "react";
import { PropsWithChildren, useContext } from "react";

type ErrorContextProps = {
    errorMessage?: string;
    resetError: () => void;
    addError: (errorMessage: string) => void;
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

    const resetError = () => setErrorMessage(undefined);
    const addError = (errorMessage: string) => setErrorMessage(errorMessage);

    return (
        <ErrorContext.Provider
            value={{
                resetError,
                addError,
                errorMessage,
            }}
        >
            {children}
        </ErrorContext.Provider>
    );
}
