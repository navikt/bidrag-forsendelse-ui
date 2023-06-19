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
import { isCountryCodeNorway } from "../types/AdresseUtils";

interface EditAddressFormProps {
    address?: DistribuerTilAdresse;
    onSubmit: (adress: DistribuerTilAdresse) => void;
    onCancel: () => void;
}

export function EditAddress() {
    return (
        <div className={"md:grow"}>
            <EditAddressLines />
            <div className="flex flex-row gap-[5px] h-max items-center">
                <EditPostcodeAndState />
                <EditCountry />
            </div>
        </div>
    );
}

export function EditAddressForm({ address, onSubmit, onCancel }: EditAddressFormProps) {
    const methods = useForm<DistribuerTilAdresse>({
        defaultValues: {
            ...address,
        },
        reValidateMode: "onSubmit",
        mode: "onSubmit",
    });

    return (
        <FormProvider {...methods}>
            <div>
                <EditAddress />
                <div className={"gap-4 flex flex-row pt-3"}>
                    <Button
                        id={"lagre_adresse_knapp"}
                        variant="tertiary"
                        size="small"
                        onClick={methods.handleSubmit(onSubmit)}
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

function EditPostcodeAndState() {
    const {
        control,
        setValue,
        register,
        clearErrors,
        formState: { errors },
    } = useFormContext<DistribuerTilAdresse>();
    const country = useWatch({ name: "land" });
    const isNorway = isCountryCodeNorway(country);

    return (
        <div className={`flex gap-x-4 pb-2 pt-2 w-full ${isNorway ? "" : "flex-col"}`}>
            {isNorway ? (
                <>
                    <Controller
                        control={control}
                        name="postnummer"
                        rules={{
                            required: "Postnummer påkrevd norske adresser",
                            validate: (value: string) => (value.length != 4 ? "Postnummer må ha 4 tegn" : true),
                        }}
                        render={({ field: { name, onChange, value, ref }, fieldState: { error } }) => (
                            <React.Suspense fallback={<Loader size="xsmall" />}>
                                <PostnummerInput
                                    defaultValue={value}
                                    inputRef={ref}
                                    error={error?.message ?? errors?.poststed?.message}
                                    name={name}
                                    onChange={(postnummer, poststed) => {
                                        onChange(postnummer);
                                        setValue("poststed", poststed);
                                        clearErrors("poststed");
                                    }}
                                />
                            </React.Suspense>
                        )}
                    />
                    <TextField
                        {...register("poststed", { required: "Skriv inn gyldig postnummer" })}
                        size="small"
                        label={"Poststed (fylles automatisk)"}
                        disabled={true}
                    />
                </>
            ) : (
                <TextField {...register("poststed")} size="small" label={"Poststed"} />
            )}
        </div>
    );
}
function EditCountry() {
    const { control, setValue, resetField } = useFormContext<DistribuerTilAdresse>();
    return (
        <Controller
            control={control}
            name="land"
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
                            setValue("postnummer", "");
                            setValue("poststed", "");
                        } else {
                            resetField("postnummer");
                            resetField("poststed");
                        }
                    }}
                />
            )}
        />
    );
}

function EditAddressLines() {
    const {
        register,
        formState: { errors },
    } = useFormContext<DistribuerTilAdresse>();

    const country = useWatch({ name: "land" });
    const isNorway = isCountryCodeNorway(country);

    return (
        <div className={"flex flex-col gap-y-4"}>
            <TextField
                size="small"
                error={errors.adresselinje1?.message}
                {...register("adresselinje1", { required: isNorway ? false : "Adresselinje1 er påkrevd" })}
                label={"Adresse"}
            />
            <TextField size="small" hideLabel {...register("adresselinje2")} label={"Adresselinje2"} />
            <TextField size="small" hideLabel {...register("adresselinje3")} label={"Adresselinje3"} />
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
            {landkoder.map((value) => {
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
