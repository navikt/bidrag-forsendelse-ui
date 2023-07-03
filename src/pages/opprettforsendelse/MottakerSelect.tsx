import { MagnifyingGlassIcon, PersonIcon, PersonPencilIcon } from "@navikt/aksel-icons";
import IdentUtils from "@navikt/bidrag-ui-common/esm/utils/IdentUtils";
import { Alert, Heading, Loader, Panel, Tabs, TextField } from "@navikt/ds-react";
import React, { useEffect, useRef, useState } from "react";
import { useWatch } from "react-hook-form";

import AdresseInfo from "../../components/AdresseInfo";
import { EditAddress } from "../../components/EditAddress";
import PersonDetaljer from "../../components/person/PersonDetaljer";
import { useForsendelseApi } from "../../hooks/useForsendelseApi";
import useSamhandlerPersonApi from "../../hooks/usePersonApi";
import {
    MottakerFormProps,
    OpprettForsendelseFormProps,
    useOpprettForsendelseFormContext,
} from "./OpprettForsendelsePage";
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
    const selectedTabOption = useRef<RADIO_OPTIONS>(selectedRadioOption);

    const mottakerCache = useRef<Map<string, MottakerFormProps>>(new Map());
    useEffect(() => {
        register("mottaker", {
            validate: () => {
                if (selectedTabOption.current == "FRITEKST") {
                    return getValues("mottaker.navn") == undefined ? "Mottaker må settes" : true;
                }
                return getValues("mottaker.ident") == undefined ? "Mottaker må settes" : true;
            },
        });
    }, []);

    function onTabChange(val: RADIO_OPTIONS) {
        setSelectedRadioOption(val);
        mottakerCache.current.set(selectedTabOption.current, getValues("mottaker"));
        selectedTabOption.current = val;
        setValue("mottaker", null);
        if (val == "SAMME_SOM_GJELDER") {
            setValue("mottaker.ident", gjelderIdent);
        } else {
            setValue("mottaker", mottakerCache.current.get(val) ?? null);
        }
    }

    console.log(watch("mottaker"));
    return (
        <div>
            <Heading size="small">Mottaker</Heading>
            <Tabs defaultValue={"SAMME_SOM_GJELDER"} onChange={onTabChange} size="small" className="w-max h-max">
                <Tabs.List>
                    <Tabs.Tab
                        value="SAMME_SOM_GJELDER"
                        label="Samme som gjelder"
                        icon={<PersonIcon title="Samme som gjelder" />}
                    />
                    <Tabs.Tab
                        value="ANNEN_MOTTAKER"
                        label="Søk annen mottaker"
                        icon={<MagnifyingGlassIcon title="Søk annen mottaker" />}
                    />
                    <Tabs.Tab value="FRITEKST" label="Fritekst" icon={<PersonPencilIcon title="Fritekst" />} />
                </Tabs.List>

                <Tabs.Panel value="SAMME_SOM_GJELDER" className="h-max  w-full bg-gray-50 p-4">
                    <PersonDetaljer copy={false} spacing={false} ident={gjelderIdent} navn={gjelder?.navn} />
                </Tabs.Panel>
                <Tabs.Panel value="ANNEN_MOTTAKER" className="h-max min-h-[100px] w-full bg-gray-50 p-4">
                    <div className="flex flex-col gap-4 w-max gap-[5px]">
                        <PersonSok
                            defaultValue={watch("mottaker.ident")}
                            onChange={(ident) => setValue("mottaker.ident", ident)}
                        />
                        <MottakerNavn />
                    </div>
                </Tabs.Panel>
                <Tabs.Panel value="FRITEKST" className="h-max w-full bg-gray-50 p-4">
                    <MottakerFritekst />
                </Tabs.Panel>
            </Tabs>
            {errors.mottaker?.message && (
                <Alert inline variant="error">
                    {errors.mottaker?.message}
                </Alert>
            )}
        </div>
    );
}

function MottakerFritekst() {
    const { register, setValue, watch, control } = useOpprettForsendelseFormContext();

    return (
        <div className="w-[300px] h-max">
            <TextField className="mb-2" size="small" label="Navn" {...register("mottaker.navn")} />
            <React.Suspense fallback={<Loader />}>
                <EditAddress formPrefix="mottaker.adresse" />
            </React.Suspense>
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
        <Panel>
            <PersonDetaljer
                copy={false}
                spacing={false}
                navn={data.navn ?? "UKJENT NAVN"}
                // ident={data.ident}
                rolle={hentRolle(data.ident)}
            />
            <div className="pt-3">
                <Heading size="xsmall">Adresse:</Heading>
                <AdresseInfo adresse={data.adresse} />
            </div>
        </Panel>
    );
}
