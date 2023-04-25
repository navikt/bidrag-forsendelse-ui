import { RolleType } from "@navikt/bidrag-ui-common";
import { Button, Cell, ContentContainer, Grid, Heading, Select } from "@navikt/ds-react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

import { BIDRAG_FORSENDELSE_API } from "../../api/api";
import { useForsendelseApi } from "../../hooks/useForsendelseApi";
import { useSession } from "../forsendelse/context/SessionContext";
import DokumentValg from "./DokumentValg";
import GjelderSelect from "./GjelderSelect";
import MottakerSelect from "./MottakerSelect";

export type OpprettForsendelseFormProps = {
    gjelderIdent: string;
    mottakerIdent: string;
    dokument: {
        malId: string;
        tittel: string;
        type: "UTGÅENDE" | "NOTAT";
    };
    språk: string;
    tema: "BID" | "FAR";
    enhet: string;
};

export const useOpprettForsendelseFormContext = () => useFormContext<OpprettForsendelseFormProps>();

export default function OpprettForsendelsePage() {
    const navigate = useNavigate();
    const { saksnummer, enhet } = useSession();
    const opprettForsendelseFn = useMutation({
        mutationFn: (data: OpprettForsendelseFormProps) =>
            BIDRAG_FORSENDELSE_API.api.opprettForsendelse({
                gjelderIdent: data.gjelderIdent,
                mottaker: {
                    ident: data.mottakerIdent,
                },
                saksnummer,
                enhet: enhet ?? "4806",
                tema: data.tema,
                språk: data.språk,
                dokumenter: [
                    {
                        dokumentmalId: data.dokument.malId,
                        tittel: data.dokument.tittel,
                        språk: data.språk,
                    },
                ],
            }),
        onSuccess: (data) => {
            const forsendelseId = data.data.forsendelseId;
            if (data.data.forsendelseType == "NOTAT") {
                navigate(`/sak/${saksnummer}/journal/BIF-${forsendelseId}`);
            } else {
                navigate(`/sak/${saksnummer}/forsendelse/${forsendelseId}`);
            }
        },
    });

    const roller = useForsendelseApi().hentRoller();
    const defaultGjelder = roller.find((rolle) => [RolleType.BM, RolleType.BP].includes(rolle.rolleType))?.ident;
    const methods = useForm<OpprettForsendelseFormProps>({
        defaultValues: {
            gjelderIdent: defaultGjelder,
            mottakerIdent: defaultGjelder,
            tema: "BID",
            språk: "NB",
        },
    });
    function onSubmit(data: OpprettForsendelseFormProps) {
        console.log("onSubmit", data);
        opprettForsendelseFn.mutate(data);
    }
    return (
        <ContentContainer>
            <Grid>
                <Cell xs={12} md={12} lg={10}>
                    <div className={"leading-xlarge tracking-wide"}>
                        <Heading spacing size="large">
                            Opprett forsendelse
                        </Heading>
                        <FormProvider {...methods}>
                            <form onSubmit={methods.handleSubmit(onSubmit)}>
                                <GjelderSelect />
                                <MottakerSelect />
                                <div>
                                    <Heading spacing size="small">
                                        Andre detaljer
                                    </Heading>
                                    <div className="flex flex-row gap-4 pb-4">
                                        <LanguageSelect />
                                        <TemaSelect />
                                    </div>
                                </div>

                                <DokumentValg />
                                <div className="flex flex-row gap-2 pt-4">
                                    <Button size="small" loading={opprettForsendelseFn.isLoading}>
                                        Opprett
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="tertiary"
                                        type="button"
                                        disabled={opprettForsendelseFn.isLoading}
                                    >
                                        Avbryt
                                    </Button>
                                </div>
                            </form>
                        </FormProvider>
                    </div>
                </Cell>
            </Grid>
        </ContentContainer>
    );
}

function TemaSelect() {
    const { register, getValues } = useOpprettForsendelseFormContext();

    const temaOptions = [
        {
            label: "Bidrag",
            value: "BID",
        },
        {
            label: "Farskap",
            value: "FAR",
        },
    ];
    return (
        <Select size="small" label="Tema" {...register("tema")} defaultValue={getValues("tema")}>
            {temaOptions.map((opt) => (
                <option value={opt.value}>{opt.label}</option>
            ))}
        </Select>
    );
}

function LanguageSelect() {
    const { register, getValues } = useOpprettForsendelseFormContext();

    const languageOptions = [
        {
            label: "Bokmål",
            value: "NB",
        },
        {
            label: "Nynorsk",
            value: "NN",
        },
        {
            label: "Engelsk",
            value: "EN",
        },
        {
            label: "Tysk",
            value: "DE",
        },
        {
            label: "Fransk",
            value: "FR",
        },
    ];
    return (
        <Select size="small" label="Språk" {...register("språk")} defaultValue={getValues("språk")}>
            {languageOptions.map((opt) => (
                <option value={opt.value}>{opt.label}</option>
            ))}
        </Select>
    );
}
