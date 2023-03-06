import { Add } from "@navikt/ds-icons";
import { Button } from "@navikt/ds-react";
import { Modal } from "@navikt/ds-react";
import { Accordion } from "@navikt/ds-react";
import { Table } from "@navikt/ds-react";
import { Loader } from "@navikt/ds-react";
import { Heading } from "@navikt/ds-react";
import dayjs from "dayjs";
import { useState } from "react";
import React from "react";

import { DokumentDto } from "../../api/BidragDokumentApi";
import { useForsendelseApi } from "../../hooks/useForsendelseApi";

export default function LeggTilDokumentKnapp() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div>
            <Button onClick={() => setModalOpen(true)} variant={"tertiary"} size={"small"} icon={<Add />}>
                Legg til dokument
            </Button>
            <LeggTilDokumentFraSakModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
}

interface LeggTilDokumentFraSakModalProps {
    open: boolean;
    onClose: () => void;
}
function LeggTilDokumentFraSakModal({ open }: LeggTilDokumentFraSakModalProps) {
    const { hentForsendelse } = useForsendelseApi();

    const forsendelse = hentForsendelse();

    const [accordionOpen, setAccordionOpen] = useState(-1);
    const [selectedDocuments, setSelectedDocuments] = useState<DokumentDto[]>([]);
    return (
        <Modal open={open} onClose={() => console.log()}>
            <Modal.Content style={{ minWidth: "500px", minHeight: "400px", padding: "1rem 2rem" }}>
                <Heading spacing level="1" size="large" id="modal-heading">
                    Legg til dokumenter
                </Heading>
                <React.Suspense fallback={<Loader size={"medium"} />}>
                    <Accordion style={{ width: "100%" }}>
                        <Accordion.Item>
                            <Accordion.Header>Fra samme sak</Accordion.Header>
                            <Accordion.Content>
                                <DokumenterForSakTabell saksnummer={forsendelse.saksnummer} />
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion>
                </React.Suspense>
            </Modal.Content>
        </Modal>
    );
}

interface DokumenterForSakTabellProps {
    saksnummer: string;
    onDocumentsSelected?: (documents: DokumentDto[]) => void;
}
function DokumenterForSakTabell({ saksnummer }: DokumenterForSakTabellProps) {
    const { hentJournalposterForSak, hentForsendelse } = useForsendelseApi();
    const journalposter = hentJournalposterForSak(saksnummer);
    console.log(journalposter);
    return (
        <Table style={{ tableLayout: "auto", display: "block" }}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col" style={{ width: "1%" }} />
                    <Table.HeaderCell scope="col" style={{ width: "15%" }}>
                        Tittel
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col" style={{ width: "5%" }}>
                        Dok. dato
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col" align={"left"} style={{ paddingRight: "100px", width: "5%" }}>
                        Gjelder
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {journalposter.map((journalpost) => (
                    <Table.ExpandableRow
                        key={journalpost.journalpostId}
                        content={<JournalpostDokumenterTabell dokumenter={journalpost.dokumenter} />}
                    >
                        <Table.DataCell>{journalpost.innhold}</Table.DataCell>
                        <Table.DataCell>{dayjs(journalpost.dokumentDato).format("DD.MM.YYYY")}</Table.DataCell>
                        <Table.DataCell>{journalpost.gjelderAktor?.ident}</Table.DataCell>
                    </Table.ExpandableRow>
                ))}
            </Table.Body>
        </Table>
    );
}

interface JournalpostDokumenterTabellProps {
    dokumenter: DokumentDto[];
}
function JournalpostDokumenterTabell({ dokumenter }: JournalpostDokumenterTabellProps) {
    return (
        <Table style={{ tableLayout: "auto", display: "block" }}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col" style={{ width: "1%" }}>
                        Nr.
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col" style={{ width: "15%" }}>
                        Tittel
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {dokumenter.map((dok, index) => (
                    <Table.Row key={index + dok.dokumentreferanse}>
                        <Table.DataCell scope="row">{index + 1}</Table.DataCell>
                        <Table.DataCell>{dok.tittel}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}
