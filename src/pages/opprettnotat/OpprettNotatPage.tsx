import { RolleType } from "@navikt/bidrag-ui-common";
import { Button, Cell, ContentContainer, Grid, Heading } from "@navikt/ds-react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "react-query";

import { BIDRAG_FORSENDELSE_API } from "../../api/api";
import { JournalTema } from "../../api/BidragForsendelseApi";
import GjelderSelect from "../../components/detaljer/GjelderSelect";
import TemaSelect from "../../components/detaljer/TemaSelect";
import DokumentValgNotat from "../../components/dokument/DokumentValgNotat";
import { useForsendelseApi } from "../../hooks/useForsendelseApi";
import { mapToBehandlingInfoDto } from "../../types/Forsendelse";
import { useSession } from "../forsendelse/context/SessionContext";
import AvbrytOpprettForsendelseButton from "../opprettforsendelse/AvbrytOpprettForsendelseButton";
import { useOpprettForsendelse } from "../opprettforsendelse/OpprettForsendelseContext";

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

export default function OpprettNotatPage() {
    const { saksnummer, enhet, navigateToForsendelse } = useSession();
    const options = useOpprettForsendelse();
    const opprettForsendelseFn = useMutation({
        mutationFn: (data: OpprettForsendelseFormProps) => {
            return BIDRAG_FORSENDELSE_API.api.opprettForsendelse({
                gjelderIdent: data.gjelderIdent,
                mottaker: {
                    ident: data.gjelderIdent,
                },
                saksnummer,
                opprettTittel: true,
                enhet: enhet,
                tema: data.tema as JournalTema,
                språk: data.språk,
                behandlingInfo: mapToBehandlingInfoDto(options),
                dokumenter: [
                    {
                        dokumentmalId: data.dokument.malId,
                        tittel: data.dokument.tittel,
                        språk: data.språk,
                        bestillDokument: true,
                    },
                ],
            });
        },
        onSuccess: (data) => {
            const forsendelseId = data.data.forsendelseId;
            navigateToForsendelse(forsendelseId?.toString(), data.data.forsendelseType);
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
        opprettForsendelseFn.mutate(data);
    }
    return (
        <ContentContainer>
            <Grid>
                <Cell xs={12} md={12} lg={10}>
                    <div className={"leading-xlarge tracking-wide"}>
                        <Heading spacing size="large">
                            Opprett notat
                        </Heading>
                        <FormProvider {...methods}>
                            <form onSubmit={methods.handleSubmit(onSubmit)}>
                                <GjelderSelect roller={roller} />
                                <div className="flex flex-row gap-4 pb-4">
                                    <TemaSelect />
                                </div>
                                <DokumentValgNotat />
                                <div className="flex flex-row gap-2 pt-4">
                                    <Button size="small" loading={opprettForsendelseFn.isLoading}>
                                        Opprett
                                    </Button>
                                    <AvbrytOpprettForsendelseButton disabled={opprettForsendelseFn.isLoading} />
                                </div>
                            </form>
                        </FormProvider>
                    </div>
                </Cell>
            </Grid>
        </ContentContainer>
    );
}
