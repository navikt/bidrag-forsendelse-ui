import { IRolleDetaljer, RolleType, RolleTypeAbbreviation, RolleTypeFullName } from "@navikt/bidrag-ui-common";
import { useQuery } from "@tanstack/react-query";

import { DokumentStatus } from "../constants/DokumentStatus";
import { SAKSNUMMER } from "../constants/fellestyper";
import { useSession } from "../pages/forsendelse/context/SessionContext";
import { queryClient } from "../pages/PageWrapper";
import { AvvikType } from "../types/AvvikTypes";
import { IDokument } from "../types/Dokument";
import { IForsendelse } from "../types/Forsendelse";
import { PostnummerPoststed } from "../types/KodeverkTypes";
import { LandkodeLand } from "../types/KodeverkTypes";
import { SAK_API } from "./api";
import { BIDRAG_DOKUMENT_API } from "./api";
import { PERSON_API } from "./api";
import { BIDRAG_FORSENDELSE_API } from "./api";
import { JournalpostDto } from "./BidragDokumentApi";
import { PersonDto } from "./BidragPersonApi";
import { PersonAdresseDto } from "./BidragPersonApi";
import { BidragSakDto } from "./BidragSakApi";
import KodeverkService from "./KodeverkService";

export const QueryKeys = {
    avvik: "avvik",
    sak: "sak",
    forsendelse: "forsendelse",
    person: "person",
    avvik_forsendelse: (forsendelseId: string) => [QueryKeys.avvik, forsendelseId],
    landkoder: ["landkoder"],
    postnummere: ["postnummere"],
    hentSak: (saksnummer: string) => [QueryKeys.sak, saksnummer],
    sakerPerson: (personident: string) => [QueryKeys.sak, QueryKeys.person, personident],
    hentJournalposterForPerson: (personident: string) => [QueryKeys.person, QueryKeys.forsendelse, personident],
};

export const ForsendelseApiHooks = {
    hentAvvik: (forsendelseId: string): AvvikType[] => {
        const { data: avvikTyper } = useQuery({
            queryKey: QueryKeys.avvik_forsendelse(forsendelseId),
            queryFn: ({ signal }) => BIDRAG_FORSENDELSE_API.api.hentAvvik(forsendelseId),
        });
        return avvikTyper.data as AvvikType[];
    },
    hentForsendelse: (): IForsendelse => {
        const { forsendelseId } = useSession();
        const { data: forsendelse, isRefetching } = useQuery({
            queryKey: "forsendelse",
            queryFn: ({ signal }) => BIDRAG_FORSENDELSE_API.api.hentForsendelse(forsendelseId),
            enabled: forsendelseId != undefined,
            optimisticResults: false,
            select: (response) => {
                const forsendelse = response.data;
                return {
                    ...forsendelse,
                    forsendelseId,
                    dokumenter: forsendelse.dokumenter.map(
                        (dokument, index) =>
                            ({
                                ...dokument,
                                status: DokumentStatus[dokument.status],
                                fraSaksnummer: forsendelse.saksnummer,
                                lagret: true,
                                index,
                            }) as IDokument
                    ),
                };
            },
            onSuccess: (data) => {
                console.log("Hentet forsendelse", data);
            },
        });

        return {
            ...forsendelse,
            isStaleData: isRefetching,
        };
    },
};
export const hentAvvik = (forsendelseId: string): AvvikType[] => {
    const { data: avvikTyper } = useQuery({
        queryKey: QueryKeys.avvik_forsendelse(forsendelseId),
        queryFn: ({ signal }) => BIDRAG_FORSENDELSE_API.api.hentAvvik(forsendelseId),
    });

    return avvikTyper.data as AvvikType[];
};
export const hentLandkoder = (): LandkodeLand[] => {
    const { data: landkoder } = useQuery({
        queryKey: QueryKeys.landkoder,
        queryFn: ({ signal }) => new KodeverkService().getLandkoder(),
    });

    return landkoder;
};

export const hentPostnummere = (): PostnummerPoststed[] => {
    const { data: postnummere } = useQuery({
        queryKey: QueryKeys.postnummere,
        queryFn: ({ signal }) => new KodeverkService().getPostnummere(),
    });

    return postnummere;
};
export const hentPersonAdresse = (ident?: string): PersonAdresseDto => {
    if (!ident) {
        return null;
    }
    const { data: personData } = useQuery({
        queryKey: `person_adresse_${ident}`,
        queryFn: ({ signal }) => PERSON_API.adresse.hentPersonPostadresse({ personident: "" }, { ident }),
    });

    return personData.data;
};

const hentSak = (): BidragSakDto => {
    const forsendelse = queryClient.getQueryData<IForsendelse>("forsendelse");
    const saksnummer = forsendelse.saksnummer;
    const { data: sak, refetch } = useQuery({
        queryKey: `sak_${saksnummer}`,
        queryFn: ({ signal }) => SAK_API.bidragSak.findMetadataForSak(saksnummer),
    });

    return sak.data;
};

export const hentJournalposterForPerson = (ident?: string): Map<SAKSNUMMER, JournalpostDto[]> => {
    if (!ident) return new Map<SAKSNUMMER, JournalpostDto[]>();
    const saker = hentSakerPerson(ident);
    const journalpostSakMap = new Map<SAKSNUMMER, JournalpostDto[]>();

    saker.forEach((saksnummer) => {
        journalpostSakMap.set(saksnummer, hentJournalposterForSak(saksnummer));
    });
    return journalpostSakMap;
};
const hentJournalposterForSak = (saksnummer: string): JournalpostDto[] => {
    console.log("Henter journalposter for sak", saksnummer);
    const { data: journalposter } = useQuery({
        queryKey: `journal_sak_${saksnummer}`,
        queryFn: ({ signal }) =>
            BIDRAG_DOKUMENT_API.sak.hentJournal(
                saksnummer,
                { fagomrade: ["BID", "FAR"] },
                {
                    paramsSerializer: {
                        indexes: null,
                    },
                }
            ),
    });

    return journalposter.data;
};

const hentSakerPerson = (ident: string): string[] => {
    const { data: sakerPerson, refetch } = useQuery({
        queryKey: QueryKeys.sakerPerson(ident),
        queryFn: ({ signal }) => SAK_API.bidragSak.find(ident),
    });

    return sakerPerson.data.map((sak) => sak.saksnummer);
};

export const hentRoller = (): IRolleDetaljer[] => {
    const sak = hentSak();

    return sak.roller.map((rolle) => ({
        rolleType: RolleTypeAbbreviation[rolle.rolleType] ?? RolleTypeFullName[rolle.rolleType],
        ident: rolle.fodselsnummer ?? rolle.samhandlerIdent,
        navn: hentPerson(rolle.fodselsnummer)?.navn,
    }));
};

const rolleISak = (ident: string): RolleType | null => {
    const sak = hentSak();
    return (
        RolleTypeAbbreviation[sak.roller?.find((r) => r.fodselsnummer == ident)?.rolleType] ??
        RolleTypeFullName[sak.roller?.find((r) => r.fodselsnummer == ident)?.rolleType]
    );
};

const hentPerson = (ident?: string): PersonDto => {
    if (!ident) {
        return { ident };
    }
    const { data: personData } = useQuery({
        queryKey: `person_${ident}`,
        queryFn: ({ signal }) => PERSON_API.informasjon.hentPersonPost({ ident }),
    });

    return personData.data;
};
export const hentGjelder = (): IRolleDetaljer => {
    const forsendelse = queryClient.getQueryData<IForsendelse>("forsendelse");
    const gjelderIdent = forsendelse.gjelderIdent;
    const person = hentPerson(gjelderIdent);

    const ident = gjelderIdent;
    const navn = person.navn;
    return {
        rolleType: rolleISak(ident),
        navn,
        ident,
    };
};

export const hentMottaker = (): IRolleDetaljer => {
    const forsendelse = queryClient.getQueryData<IForsendelse>("forsendelse");
    let mottaker = forsendelse.mottaker;
    // TODO: Sjekk om mottaker er samhandler

    if (!mottaker.navn) {
        mottaker = hentPerson(mottaker.ident);
    }

    const ident = mottaker.ident;
    const navn = mottaker.navn;
    return {
        rolleType: rolleISak(ident),
        navn,
        ident,
    };
};
