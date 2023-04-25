import { createContext } from "react";
import { PropsWithChildren } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";

interface IErrorContext {
    validationErrors: string[];
    errors: string[];
    addError: (error: string) => void;
    addValidationError: (error: string) => void;
    resetValidationError: () => void;
    resetErrors: () => void;
}

interface IValidationError {
    message: string;
}

interface IError {
    message: string;
}

export const ErrorContext = createContext<IErrorContext>({} as IErrorContext);

function ErrorProvider({ children }: PropsWithChildren) {
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [errors2, setErrors] = useState<string[]>([]);
    const {
        formState: { errors },
    } = useFormContext();

    function addValidationError(validationError: string) {
        setValidationErrors((errors) => [...errors, validationError]);
    }
    function addError(error: string) {
        setErrors((errors) => [...errors, error]);
    }
    console.log(errors);
    return (
        <ErrorContext.Provider
            value={{
                validationErrors,
                errors: errors2,
                addValidationError,
                addError,
                resetValidationError: () => setValidationErrors([]),
                resetErrors: () => setErrors([]),
            }}
        >
            {children}
        </ErrorContext.Provider>
    );
}
function useError() {
    const context = useContext(ErrorContext);
    if (context === undefined) {
        throw new Error("useError must be used within a ErrorProvider");
    }
    return context;
}

export { ErrorProvider, useError };