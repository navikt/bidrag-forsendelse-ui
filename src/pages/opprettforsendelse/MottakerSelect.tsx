import IdentUtils from "@navikt/bidrag-ui-common/esm/utils/IdentUtils";
import { Alert, BodyShort, Heading, Loader, Radio, RadioGroup } from "@navikt/ds-react";
import React, { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";

import PersonDetaljer from "../../components/person/PersonDetaljer";
import { useForsendelseApi } from "../../hooks/useForsendelseApi";
import useSamhandlerPersonApi from "../../hooks/usePersonApi";
import { OpprettForsendelseFormProps, useOpprettForsendelseFormContext } from "./OpprettForsendelsePage";
import PersonSok from "./PersonSok";

type RADIO_OPTIONS = "SAMME_SOM_GJELDER" | "ANNEN_MOTTAKER";
export default function MottakerSelect() {
    const roller = useForsendelseApi().hentRoller();
    const { register, setValue, watch } = useOpprettForsendelseFormContext();
    const gjelderIdent: string = useWatch<OpprettForsendelseFormProps>({ name: "gjelderIdent" }) as string;
    const gjelder = roller.find((rolle) => rolle.ident == gjelderIdent);
    const [selectedRadioOption, setSelectedRadioOption] = useState<RADIO_OPTIONS>("SAMME_SOM_GJELDER");

    useEffect(() => {
        register("mottakerIdent", { required: "Mottaker må settes" });
    }, []);

    function onRadioChange(val: RADIO_OPTIONS) {
        setSelectedRadioOption(val);
        if (val == "SAMME_SOM_GJELDER") {
            setValue("mottakerIdent", gjelderIdent);
        } else {
            setValue("mottakerIdent", null);
        }
    }
    return (
        <div>
            <RadioGroup
                defaultValue={"SAMME_SOM_GJELDER"}
                legend={<Heading size="small">Mottaker</Heading>}
                onChange={onRadioChange}
            >
                <Radio value="SAMME_SOM_GJELDER">
                    <div>
                        <BodyShort spacing size="small">
                            Samme som gjelder
                        </BodyShort>
                        <PersonDetaljer copy={false} spacing={false} ident={gjelderIdent} navn={gjelder?.navn} />
                    </div>
                </Radio>
                <Radio value="ANNEN_MOTTAKER">
                    <div>
                        <BodyShort spacing size="small">
                            Annen mottaker
                        </BodyShort>
                        {selectedRadioOption == "ANNEN_MOTTAKER" && (
                            <div className="flex flex-col gap-3">
                                <PersonSok onChange={(ident) => setValue("mottakerIdent", ident)} />
                                <MottakerNavn />
                            </div>
                        )}
                    </div>
                </Radio>
            </RadioGroup>
        </div>
    );
}

function MottakerNavn() {
    const mottakerIdent: string = useWatch<OpprettForsendelseFormProps>({ name: "mottakerIdent" }) as string;
    const { data, isFetching, isError } = useSamhandlerPersonApi().hentSamhandlerEllerPersonForIdent(mottakerIdent);

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
    return <PersonDetaljer copy={false} spacing={false} navn={data.navn ?? "UKJENT NAVN"} ident={data.ident} />;
}
