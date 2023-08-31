import { Locked } from "@navikt/ds-icons";
import { Cancel } from "@navikt/ds-icons";
import { Loader, TextField } from "@navikt/ds-react";
import { Select } from "@navikt/ds-react";
import { Button } from "@navikt/ds-react";
import { ChangeEvent } from "react";
import React from "react";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { useWatch } from "react-hook-form";

import { DistribuerTilAdresse } from "../api/BidragDokumentApi";
import { hentPostnummere } from "../api/queries";
import { hentLandkoder } from "../api/queries";
import { IMottakerAdresse } from "../types/Adresse";
import { countryCodeIso2ToIso3, isCountryCodeNorway } from "../utils/AdresseUtils";

interface EditAddressFormProps {
    address?: IMottakerAdresse;
    onSubmit: (adress: IMottakerAdresse) => void;
    onCancel: () => void;
}

type EditAddressProps = {
    formPrefix?: string;
};
export function EditAddress(props: EditAddressProps) {
    const formPrefix = props.formPrefix ? `${props.formPrefix}.` : "";
    const country = useWatch({ name: `${formPrefix}land` });
    const isNorway = isCountryCodeNorway(country);
    return (
        <div className={"md:grow"}>
            <EditAddressLines {...props} />
            <div className="flex  gap-[5px] h-max items-center" style={{ flexDirection: isNorway ? "column" : "row" }}>
                <EditPostcodeAndState {...props} />
                <EditCountry {...props} />
            </div>
        </div>
    );
}

export function EditAddressForm({ address, onSubmit, onCancel }: EditAddressFormProps) {
    const methods = useForm<IMottakerAdresse>({
        defaultValues: {
            ...address,
        },
        reValidateMode: "onSubmit",
        mode: "onSubmit",
    });

    function onFormSubmit(submitAdresse: IMottakerAdresse) {
        onSubmit({
            ...submitAdresse,
            landkode: submitAdresse.land,
            landkode3: countryCodeIso2ToIso3(submitAdresse.land),
        });
    }

    return (
        <FormProvider {...methods}>
            <div>
                <EditAddress />
                <div className={"gap-4 flex flex-row pt-3"}>
                    <Button
                        id={"lagre_adresse_knapp"}
                        variant="tertiary"
                        size="small"
                        onClick={methods.handleSubmit(onFormSubmit)}
                        icon={<Locked fr="true" />}
                    >
                        Lagre
                    </Button>
                    <Button
                        id={"forkast_adresse_endringer_knapp"}
                        variant="tertiary"
                        size="small"
                        onClick={onCancel}
                        icon={<Cancel fr="true" />}
                    >
                        Forkast
                    </Button>
                </div>
            </div>
        </FormProvider>
    );
}

function EditPostcodeAndState(props: EditAddressProps) {
    const {
        control,
        setValue,
        register,
        clearErrors,
        formState: { errors },
    } = useFormContext<DistribuerTilAdresse>();
    const formPrefix = props.formPrefix ? `${props.formPrefix}.` : "";
    const country = useWatch({ name: `${formPrefix}land` });
    const isNorway = isCountryCodeNorway(country);

    const getErrorMessage = () => {
        let error = errors;
        if (formPrefix) {
            formPrefix.split(".").forEach((splitKey) => {
                if (splitKey.length > 0 && error) {
                    error = error[splitKey];
                }
            });
        }
        return error?.poststed?.message;
    };

    const poststedFormKey = `${formPrefix}poststed`;
    const postnummerFormKey = `${formPrefix}postnummer`;
    return (
        <div className={`flex gap-x-4 pb-2 pt-2 w-auto ${isNorway ? "self-start" : "flex-col"}`}>
            {isNorway ? (
                <>
                    <Controller
                        control={control}
                        name={postnummerFormKey as "postnummer"}
                        rules={{
                            required: "Postnummer påkrevd norske adresser",
                            validate: (value: string) => (value.length != 4 ? "Postnummer må ha 4 tegn" : true),
                        }}
                        render={({ field: { name, onChange, value, ref }, fieldState: { error } }) => (
                            <React.Suspense fallback={<Loader size="xsmall" />}>
                                <PostnummerInput
                                    defaultValue={value}
                                    inputRef={ref}
                                    error={error?.message ?? getErrorMessage()}
                                    name={name}
                                    onChange={(postnummer, poststed) => {
                                        onChange(postnummer);
                                        setValue(poststedFormKey as "poststed", poststed);
                                        clearErrors(poststedFormKey as "poststed");
                                    }}
                                />
                            </React.Suspense>
                        )}
                    />
                    <TextField
                        {...register(poststedFormKey as "poststed", { required: "Skriv inn gyldig postnummer" })}
                        size="small"
                        className="w-full"
                        label={"Poststed (fylles automatisk)"}
                        disabled={true}
                    />
                </>
            ) : (
                <TextField {...register(poststedFormKey as "poststed")} size="small" label={"Poststed"} />
            )}
        </div>
    );
}
function EditCountry(props: EditAddressProps) {
    const { control, setValue, resetField } = useFormContext<DistribuerTilAdresse>();
    const formPrefix = props.formPrefix ? `${props.formPrefix}.` : "";

    const landFormKey = `${formPrefix}land`;

    const poststedFormKey = `${formPrefix}poststed`;
    const postnummerFormKey = `${formPrefix}postnummer`;
    return (
        <Controller
            control={control}
            name={landFormKey as "land"}
            rules={{ required: "Land er påkrevd" }}
            render={({ field: { name, onChange, value, ref }, fieldState: { error } }) => (
                <SelectableCountry
                    inputRef={ref}
                    name={name}
                    defaultValue={value}
                    error={error?.message}
                    onChange={(landkode) => {
                        onChange(landkode);
                        if (!isCountryCodeNorway(landkode)) {
                            setValue(postnummerFormKey as "postnummer", "");
                            setValue(poststedFormKey as "poststed", "");
                        } else {
                            resetField(postnummerFormKey as "postnummer");
                            resetField(poststedFormKey as "poststed");
                        }
                    }}
                />
            )}
        />
    );
}

function EditAddressLines(props: EditAddressProps) {
    const {
        register,
        formState: { errors },
    } = useFormContext<DistribuerTilAdresse>();
    const formPrefix = props.formPrefix ? `${props.formPrefix}.` : "";

    const country = useWatch({ name: `${formPrefix}land` });
    const isNorway = isCountryCodeNorway(country);
    const getError = () => {
        let error = errors;
        if (formPrefix) {
            formPrefix.split(".").forEach((splitKey) => {
                if (splitKey.length > 0 && error) {
                    error = error[splitKey];
                }
            });
        }
        return error?.adresselinje1?.message;
    };

    return (
        <div className={"flex flex-col gap-y-4"}>
            <TextField
                size="small"
                error={getError()}
                {...register(`${formPrefix}adresselinje1` as "adresselinje1", {
                    required: isNorway ? false : "Adresselinje1 er påkrevd",
                })}
                label={"Adresse"}
            />
            <TextField
                size="small"
                hideLabel
                {...register(`${formPrefix}adresselinje2` as "adresselinje2")}
                label={"Adresselinje2"}
            />
            <TextField
                size="small"
                hideLabel
                {...register(`${formPrefix}adresselinje3` as "adresselinje3")}
                label={"Adresselinje3"}
            />
        </div>
    );
}
interface SelectablePostnummerProps {
    defaultValue: string;
    onChange: (postnummer: string, poststed: string) => void;
    inputRef?: (instance: any) => void;
    name?: string;
    error?: string;
}

function PostnummerInput({ onChange, defaultValue, inputRef, name, error }: SelectablePostnummerProps) {
    const [value, setValue] = useState<string>(defaultValue);
    const postnummere = hentPostnummere();

    function getPoststedByPostnummer(postnummer?: string) {
        if (!postnummer) {
            return undefined;
        }
        const postnummerValue = postnummere.find((value) => Object.keys(value)[0] === postnummer);
        return postnummerValue ? postnummerValue[postnummer] : undefined;
    }

    function onInputChange(event: ChangeEvent<HTMLInputElement>) {
        const postnummer = event.target.value;
        if (postnummer.length <= 4) {
            onChange(postnummer, getPoststedByPostnummer(postnummer));
            setValue(postnummer);
        }
    }

    return (
        <TextField
            defaultValue={defaultValue}
            value={value}
            name={name}
            error={error}
            type="number"
            ref={inputRef}
            size="small"
            label={"Postnummer"}
            onChange={onInputChange}
        />
    );
}

interface SelectableCountry {
    defaultValue: string;
    onChange: (landkode: string, land: string) => void;
    inputRef?: (instance: any) => void;
    name?: string;
    error?: string;
}

function SelectableCountry({ onChange, defaultValue, inputRef, name, error }: SelectableCountry) {
    const landkoder = hentLandkoder();

    function onSelected(event: ChangeEvent<HTMLSelectElement>) {
        const landkode = event.target.value;
        onChange(landkode, landkode ? getLandByLandkode(landkode) : undefined);
    }

    function getLandByLandkode(landkode: string) {
        return landkoder.find((value) => Object.keys(value)[0] === landkode)[landkode];
    }

    return (
        <Select
            error={error}
            ref={inputRef}
            name={name}
            size="small"
            label="Land"
            className="h-max"
            onChange={onSelected}
            defaultValue={defaultValue}
        >
            <option value={undefined}>{""}</option>
            {landkoder
                .sort((a, b) => {
                    const landkodeA = Object.keys(a)[0];
                    const landkodeB = Object.keys(b)[0];
                    const landA = a[landkodeA];
                    const landB = b[landkodeB];
                    return landA.localeCompare(landB);
                })
                .map((value) => {
                    const landkode = Object.keys(value)[0];
                    const land = value[landkode];
                    return (
                        <option key={landkode} value={landkode}>
                            {land}
                        </option>
                    );
                })}
        </Select>
    );
}
