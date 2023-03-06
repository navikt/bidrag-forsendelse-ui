import { useQuery } from "react-query";

import { BIDRAG_FORSENDELSE_API } from "../api/api";
import { PERSON_API } from "../api/api";
import { SAK_API } from "../api/api";
import { BIDRAG_DOKUMENT_API } from "../api/api";
import { JournalpostDto } from "../api/BidragDokumentApi";
import { ForsendelseResponsTo } from "../api/BidragForsendelseApi";
import { PersonDto } from "../api/BidragPersonApi";
import { BidragSakDto } from "../api/BidragSakApi";
import { SAKSNUMMER } from "../constants/fellestyper";
import { RolleType } from "../constants/RolleType";
import { useForsendelse } from "../pages/forsendelse/context/ForsendelseContext";
import { IRolleDetaljer } from "../types/forsendelseInternal";

interface UseForsendelseDataProps {
    hentForsendelse: () => ForsendelseResponsTo;
    hentGjelder: () => IRolleDetaljer;
    hentMottaker: () => IRolleDetaljer;
    hentRoller: () => IRolleDetaljer[];
    hentJournalposterForPerson: (ident: string) => Map<SAKSNUMMER, JournalpostDto[]>;
    hentJournalposterForSak: (saksnummer: string) => JournalpostDto[];
}
export function useForsendelseApi(): UseForsendelseDataProps {
    const { forsendelseId } = useForsendelse();
    const hentSak = (): BidragSakDto => {
        const forsendelse = hentForsendelseQuery();
        const saksnummer = forsendelse.saksnummer;
        const { data: sak, refetch } = useQuery({
            queryKey: `sak_${saksnummer}`,
            queryFn: ({ signal }) => SAK_API.bidragSak.findMetadataForSak(saksnummer),
        });

        return sak.data;
    };

    const hentJournalposterForPerson = (ident: string): Map<SAKSNUMMER, JournalpostDto[]> => {
        const saker = hentSakerPerson(ident);
        const journalpostSakMap = new Map<SAKSNUMMER, JournalpostDto[]>();

        saker.forEach((saksnummer) => {
            journalpostSakMap.set(saksnummer, hentJournalposterForSak(saksnummer));
        });
        return journalpostSakMap;
    };
    const hentJournalposterForSak = (saksnummer: string): JournalpostDto[] => {
        const { data: journalposter, refetch } = useQuery({
            queryKey: `journal_sak_${saksnummer}`,
            queryFn: ({ signal }) => BIDRAG_DOKUMENT_API.sak.hentJournal(saksnummer),
        });

        return journalposter.data;
    };

    const hentSakerPerson = (ident: string): string[] => {
        const { data: sakerPerson, refetch } = useQuery({
            queryKey: `saker_person_${ident}`,
            queryFn: ({ signal }) => SAK_API.bidragSak.find(ident),
        });

        return sakerPerson.data.map((sak) => sak.saksnummer);
    };

    const hentRoller = (): IRolleDetaljer[] => {
        const sak = hentSak();

        return sak.roller.map((rolle) => ({
            rolleType: RolleType[rolle.rolleType],
            ident: rolle.fodselsnummer ?? rolle.samhandlerIdent,
            navn: hentPerson(rolle.fodselsnummer)?.navn,
        }));
    };

    const rolleISak = (ident: string): RolleType | null => {
        const sak = hentSak();
        return RolleType[sak.roller?.find((r) => r.fodselsnummer == ident)?.rolleType];
    };

    const hentPerson = (ident?: string): PersonDto => {
        if (!ident) {
            return { ident };
        }
        const { data: personData, refetch } = useQuery({
            queryKey: `person_${ident}`,
            queryFn: ({ signal }) => PERSON_API.informasjon.hentPersonPost({ ident }),
        });

        return personData.data;
    };
    const hentGjelder = (): IRolleDetaljer => {
        const forsendelse = hentForsendelseQuery();
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

    const hentMottaker = (): IRolleDetaljer => {
        const forsendelse = hentForsendelseQuery();
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
    const hentForsendelseQuery = (): ForsendelseResponsTo => {
        const { data: forsendelse, refetch } = useQuery({
            queryKey: "forsendelse",
            queryFn: ({ signal }) => BIDRAG_FORSENDELSE_API.api.hentForsendelse(forsendelseId),
            enabled: forsendelseId != undefined,
        });

        return forsendelse.data;
    };

    return {
        hentForsendelse: hentForsendelseQuery,
        hentMottaker,
        hentGjelder,
        hentRoller,
        hentJournalposterForPerson,
        hentJournalposterForSak,
    };
}
