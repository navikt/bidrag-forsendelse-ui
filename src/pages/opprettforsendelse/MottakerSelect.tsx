import IdentUtils from "@navikt/bidrag-ui-common/esm/utils/IdentUtils";
import { Alert, BodyShort, Heading, Loader, Radio, RadioGroup, TextField } from "@navikt/ds-react";
import React, { useEffect, useRef, useState } from "react";
import { useWatch } from "react-hook-form";

import PersonDetaljer from "../../components/person/PersonDetaljer";
import { useForsendelseApi } from "../../hooks/useForsendelseApi";
import useSamhandlerPersonApi from "../../hooks/usePersonApi";
import { OpprettForsendelseFormProps, useOpprettForsendelseFormContext } from "./OpprettForsendelsePage";
import PersonSok from "./PersonSok";

type RADIO_OPTIONS = "SAMME_SOM_GJELDER" | "ANNEN_MOTTAKER" | "FRITEKST";
export default function MottakerSelect() {
    const roller = useForsendelseApi().hentRoller();
    const {
        register,
        setValue,
        watch,
        getValues,
        formState: { errors },
    } = useOpprettForsendelseFormContext();
    const gjelderIdent: string = useWatch<OpprettForsendelseFormProps>({ name: "gjelderIdent" }) as string;
    const gjelder = roller.find((rolle) => rolle.ident == gjelderIdent);
    const [selectedRadioOption, setSelectedRadioOption] = useState<RADIO_OPTIONS>("SAMME_SOM_GJELDER");
    const selectedRadioOptionRef = useRef<RADIO_OPTIONS>(selectedRadioOption);

    useEffect(() => {
        register("mottaker", {
            validate: () => {
                if (selectedRadioOptionRef.current == "FRITEKST") {
                    return getValues("mottaker.navn") == undefined ? "Mottaker må settes" : true;
                }
                return getValues("mottaker.ident") == undefined ? "Mottaker må settes" : true;
            },
        });
    }, []);

    function onRadioChange(val: RADIO_OPTIONS) {
        setSelectedRadioOption(val);
        selectedRadioOptionRef.current = val;
        setValue("mottaker.navn", null);
        if (val == "SAMME_SOM_GJELDER") {
            setValue("mottaker.ident", gjelderIdent);
        } else {
            setValue("mottaker.ident", null);
        }
    }

    function renderMottaker() {
        if (selectedRadioOption == "ANNEN_MOTTAKER") {
            return (
                <div className="flex flex-col gap-3 w-max gap-[5px]">
                    <PersonSok onChange={(ident) => setValue("mottaker.ident", ident)} />
                    <MottakerNavn />
                </div>
            );
        } else if (selectedRadioOption == "FRITEKST") {
            return <MottakerFritekst />;
        }
    }

    return (
        <div>
            <RadioGroup
                defaultValue={"SAMME_SOM_GJELDER"}
                legend={<Heading size="small">Mottaker</Heading>}
                onChange={onRadioChange}
                error={errors.mottaker?.message}
                size="small"
            >
                <Radio value="SAMME_SOM_GJELDER">
                    <BodyShort spacing size="small">
                        Samme som gjelder
                    </BodyShort>
                </Radio>
                <div className="mb-2 ml-2">
                    <PersonDetaljer copy={false} spacing={false} ident={gjelderIdent} navn={gjelder?.navn} />
                </div>

                <Radio value="ANNEN_MOTTAKER">
                    <div>
                        <BodyShort spacing size="small">
                            Søk annen mottaker
                        </BodyShort>
                    </div>
                </Radio>
                <Radio value="FRITEKST">
                    <div>
                        <BodyShort spacing size="small">
                            Fritekst
                        </BodyShort>
                    </div>
                </Radio>
            </RadioGroup>
            <div className="mt-2 mb-2 font-bold">{renderMottaker()}</div>
        </div>
    );
}

function MottakerFritekst() {
    const { register, setValue, watch, control } = useOpprettForsendelseFormContext();

    return (
        <div className="w-[300px]">
            <TextField className="mb-2" size="small" label="Navn" {...register("mottaker.navn")} />
        </div>
    );
}

function MottakerNavn() {
    const mottakerIdent: string = useWatch<OpprettForsendelseFormProps>({ name: "mottaker.ident" }) as string;
    const { data, isFetching, isError } = useSamhandlerPersonApi().hentSamhandlerEllerPersonForIdent(mottakerIdent);
    const roller = useForsendelseApi().hentRoller();
    function hentRolle(ident: string) {
        return roller.find((rolle) => rolle.ident == ident)?.rolleType;
    }

    if (isFetching) {
        return <Loader size="xsmall" />;
    }
    if (isError) {
        return (
            <Alert variant="info" inline>
                Fant ikke {IdentUtils.isFnr(mottakerIdent) ? "Person" : "Samhandler"} med ident {mottakerIdent}
            </Alert>
        );
    }
    if (!data?.valid) return null;
    return (
        <PersonDetaljer
            copy={false}
            spacing={false}
            navn={data.navn ?? "UKJENT NAVN"}
            ident={data.ident}
            rolle={hentRolle(data.ident)}
        />
    );
}
