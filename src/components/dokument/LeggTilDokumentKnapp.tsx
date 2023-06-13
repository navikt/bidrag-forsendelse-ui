import "./LeggTilDokumentButton.css";

import { RolleType } from "@navikt/bidrag-ui-common";
import { Add } from "@navikt/ds-icons";
import { Collapse } from "@navikt/ds-icons";
import { Expand } from "@navikt/ds-icons";
import { Button, Table, Tabs } from "@navikt/ds-react";
import { Modal } from "@navikt/ds-react";
import { Loader } from "@navikt/ds-react";
import { Heading } from "@navikt/ds-react";
import { Accordion } from "@navikt/ds-react";
import { Tag } from "@navikt/ds-react";
import { Checkbox } from "@navikt/ds-react";
import { BodyShort } from "@navikt/ds-react";
import dayjs from "dayjs";
import { useState } from "react";
import React from "react";
import { useEffect } from "react";

import { DokumentStatus } from "../../constants/DokumentStatus";
import { useForsendelseApi } from "../../hooks/useForsendelseApi";
import { useDokumenterForm } from "../../pages/forsendelse/context/DokumenterFormContext";
import { IDokument } from "../../types/Dokument";
import {
    IDokumentJournalDto,
    IJournalpost,
    JournalpostStatus,
    journalstatusToDisplayValue,
} from "../../types/Journalpost";
import { mapRolleToDisplayValue } from "../../types/RolleMapper";
import JournalpostStatusTag from "../journalpost/JournalpostStatusTag";
import DokumentStatusTag from "./DokumentStatusTag";
import OpenDokumentButton from "./OpenDokumentButton";

export default function LeggTilDokumentKnapp() {
    const { addDocuments } = useDokumenterForm();
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div>
            <Button onClick={() => setModalOpen(true)} variant={"tertiary"} size={"small"} icon={<Add />}>
                Legg til dokument
            </Button>
            <LeggTilDokumentFraSakModal
                open={modalOpen}
                onClose={(selectedDocuments) => {
                    addDocuments(selectedDocuments);
                    setModalOpen(false);
                }}
            />
        </div>
    );
}

interface LeggTilDokumentFraSakModalProps {
    onClose: (selectedDocuments: IDokument[]) => void;
    open: boolean;
}
function LeggTilDokumentFraSakModal({ onClose, open }: LeggTilDokumentFraSakModalProps) {
    const [selectedDocuments, setSelectedDocuments] = useState<IDokument[]>([]);
    const { hentForsendelse } = useForsendelseApi();
    const saksnummer = hentForsendelse().saksnummer;
    function selectDocument(document: IDokument, toggle = true) {
        const isSelected = (d) =>
            d.dokumentreferanse
                ? d.dokumentreferanse == document.dokumentreferanse
                : d.journalpostId == document.journalpostId;
        setSelectedDocuments((selectedDocuments) => {
            const isDocumentSelected = selectedDocuments.some(isSelected);
            if (isDocumentSelected) {
                return toggle ? selectedDocuments.filter((d) => !isSelected(d)) : selectedDocuments;
            }
            const rolle = document.fraRolle ? mapRolleToDisplayValue(document.fraRolle) : "";
            const title =
                saksnummer == document.fraSaksnummer
                    ? document.tittel
                    : `${document.tittel} (Fra ${rolle} sak ${document.fraSaksnummer})`;
            return [...selectedDocuments, { ...document, tittel: title }];
        });
    }

    function unselectDocument(document: IDokument) {
        const isSelected = (d) =>
            d.dokumentreferanse
                ? d.dokumentreferanse == document.dokumentreferanse
                : d.journalpostId == document.journalpostId;
        setSelectedDocuments((selectedDocuments) => selectedDocuments.filter((d) => !isSelected(d)));
    }

    useEffect(() => {
        setSelectedDocuments([]);
    }, [open]);

    useEffect(() => {
        Modal.setAppElement("#forsendelse-page");
    }, []);

    return (
        <Modal open={open} onClose={() => onClose([])}>
            <Modal.Content style={{ width: "80vw", height: "70vh", padding: "1rem 2rem", overflow: "hidden" }}>
                <Heading spacing level="1" size="large" id="modal-heading">
                    Legg til dokumenter
                </Heading>
                <React.Suspense fallback={<Loader size={"medium"} />}>
                    <VelgDokumentTabs
                        selectDocument={selectDocument}
                        unselectDocument={unselectDocument}
                        selectedDocuments={selectedDocuments}
                    />
                </React.Suspense>
            </Modal.Content>
            <Modal.Content>
                <div className={"ml-2 flex flex-row gap-2 items-end bottom-2"}>
                    <Button size="small" onClick={() => onClose(selectedDocuments)}>
                        Legg til valgte
                    </Button>
                    <Button size="small" variant={"tertiary"} onClick={() => onClose([])}>
                        Avbryt
                    </Button>
                </div>
            </Modal.Content>
        </Modal>
    );
}
interface VelgDokumentTabsProps {
    selectDocument: (documents: IDokument, toogle: boolean) => void;
    unselectDocument: (documents: IDokument) => void;
    selectedDocuments: IDokument[];
}
function VelgDokumentTabs({ selectDocument, selectedDocuments, unselectDocument }: VelgDokumentTabsProps) {
    const { hentForsendelse, hentRoller } = useForsendelseApi();
    const [tabState, setTabState] = useState("fra_samme_sak");
    const forsendelse = hentForsendelse();
    const roller = hentRoller();
    const renderLabel = (label: string, saksnummer?: string, rolle?: RolleType) => {
        const numberOfSelectedDocuments = selectedDocuments.filter(
            (d) => (saksnummer && d.fraSaksnummer == saksnummer) || (rolle && d.fraRolle == rolle)
        ).length;
        if (numberOfSelectedDocuments > 0) {
            return (
                <div>
                    {label}{" "}
                    <Tag variant={"info"} size="small">
                        {numberOfSelectedDocuments}
                    </Tag>
                </div>
            );
        }

        return <div>{label}</div>;
    };
    return (
        <Tabs value={tabState} onChange={setTabState}>
            <Tabs.List>
                <Tabs.Tab value="fra_samme_sak" label={renderLabel("Fra samme sak", forsendelse.saksnummer)} />
                <Tabs.Tab value="bm" label={renderLabel("Fra BM saker", null, RolleType.BM)} />
                <Tabs.Tab value="bp" label={renderLabel("Fra BP saker", null, RolleType.BP)} />
            </Tabs.List>
            <Tabs.Panel value="fra_samme_sak" className="w-full ">
                <React.Suspense fallback={<Loader size={"small"} />}>
                    <DokumenterForSakTabell
                        saksnummer={forsendelse.saksnummer}
                        selectedDocuments={selectedDocuments}
                        selectDocument={selectDocument}
                        unselectDocument={unselectDocument}
                    />
                </React.Suspense>
            </Tabs.Panel>
            <Tabs.Panel value="bm" className="h-24 w-full">
                <Accordion style={{ width: "100%" }}>
                    <React.Suspense fallback={<Loader size={"small"} />}>
                        <DokumenterForPerson
                            rolle={RolleType.BM}
                            selectedDocuments={selectedDocuments}
                            unselectDocument={unselectDocument}
                            selectDocument={(dokument, toogle) =>
                                selectDocument({ ...dokument, fraRolle: RolleType.BM }, toogle)
                            }
                            ident={roller.find((r) => r.rolleType == RolleType.BM).ident}
                        />
                    </React.Suspense>
                </Accordion>
            </Tabs.Panel>
            <Tabs.Panel value="bp" className="w-full">
                <Accordion style={{ width: "100%" }}>
                    <React.Suspense fallback={<Loader size={"small"} />}>
                        <DokumenterForPerson
                            rolle={RolleType.BP}
                            selectedDocuments={selectedDocuments}
                            unselectDocument={unselectDocument}
                            selectDocument={(dokument, toogle) =>
                                selectDocument({ ...dokument, fraRolle: RolleType.BP }, toogle)
                            }
                            ident={roller.find((r) => r.rolleType == RolleType.BP)?.ident}
                        />
                    </React.Suspense>
                </Accordion>
            </Tabs.Panel>
        </Tabs>
    );
}

interface DokumenterForPersonProps {
    rolle: RolleType;
    ident: string;
    selectDocument: (documents: IDokument, toogle?: boolean) => void;
    unselectDocument: (documents: IDokument) => void;
    selectedDocuments: IDokument[];
}

function DokumenterForPerson({
    ident,
    selectDocument,
    unselectDocument,
    selectedDocuments,
    rolle,
}: DokumenterForPersonProps) {
    const { hentJournalposterForPerson, hentForsendelse } = useForsendelseApi();
    const forsendelseSaksnummer = hentForsendelse().saksnummer;

    const journalposterForSak = hentJournalposterForPerson(ident);
    const renderAccordionHeader = (saksnummer: string) => {
        const numberOfSelectedDocuments = selectedDocuments.filter((d) => d.fraSaksnummer == saksnummer).length;
        if (numberOfSelectedDocuments > 0) {
            return (
                <div>
                    Sak {saksnummer}{" "}
                    <Tag variant={"info"} size="small">
                        {numberOfSelectedDocuments}
                    </Tag>
                </div>
            );
        }

        return <div>Sak {saksnummer}</div>;
    };
    const rolleSaksnummere = Array.from(journalposterForSak.keys()).filter(
        (saksnummer) => saksnummer != forsendelseSaksnummer
    );
    if (rolleSaksnummere.length == 0) {
        return <div className={"p-2"}>Det finnes ikke flere saker for {rolle}</div>;
    }
    return (
        <>
            {rolleSaksnummere.map((saksnummer) => {
                return (
                    <Accordion.Item defaultOpen style={{ minWidth: "3rem" }}>
                        <Accordion.Header>{renderAccordionHeader(saksnummer)}</Accordion.Header>
                        <Accordion.Content>
                            <DokumenterForSakTabell
                                saksnummer={saksnummer}
                                selectedDocuments={selectedDocuments}
                                selectDocument={selectDocument}
                                unselectDocument={unselectDocument}
                            />
                        </Accordion.Content>
                    </Accordion.Item>
                );
            })}
        </>
    );
}

interface DokumenterForSakTabellProps {
    fraRolle?: RolleType;
    saksnummer: string;
    selectDocument: (dokument: IDokument, toogle?: boolean) => void;
    unselectDocument: (documents: IDokument) => void;
    selectedDocuments: IDokument[];
}
function DokumenterForSakTabell({
    saksnummer,
    selectDocument,
    unselectDocument,
    selectedDocuments,
    fraRolle,
}: DokumenterForSakTabellProps) {
    const { hentJournalposterForSak, hentForsendelse } = useForsendelseApi();
    const { dokumenter } = useDokumenterForm();
    const journalposter = hentJournalposterForSak(saksnummer);
    const forsendelse = hentForsendelse();
    return (
        <Table style={{ display: "block", overflowY: "auto", maxHeight: "100%", width: "100%" }}>
            <Table.Header style={{ position: "sticky" }}>
                <Table.Row>
                    <Table.DataCell style={{ width: "2%" }} />
                    <Table.HeaderCell scope="col" style={{ width: "20%" }}>
                        Tittel
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col" style={{ width: "5%" }}>
                        Dok. dato
                    </Table.HeaderCell>

                    <Table.HeaderCell scope="col" style={{ width: "5%" }}>
                        Type
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col" style={{ width: "5%" }} align={"left"}>
                        Gjelder
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col" style={{ width: "5%" }}>
                        Status
                    </Table.HeaderCell>
                    <Table.DataCell style={{ width: "2%" }} />
                    <Table.DataCell style={{ width: "2%" }} />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {journalposter
                    .filter((jp) => jp.dokumentType != "X")
                    .filter((jp) => jp.journalstatus != JournalpostStatus.UNDER_OPPRETELSE)
                    .filter((jp) => jp.feilfort != true)
                    .filter((jp) => jp.journalpostId != `BIF-${forsendelse.forsendelseId?.replace("BIF-", "")}`)
                    .map((journalpost) => {
                        return (
                            <JournalpostDokumenterRowMultiDoc
                                fraRolle={fraRolle}
                                saksnummer={saksnummer}
                                journalpost={journalpost}
                                selectDocument={selectDocument}
                                unselectDocument={unselectDocument}
                                selectedDocuments={selectedDocuments}
                            />
                        );
                    })}
            </Table.Body>
        </Table>
    );
}

interface JournalpostDokumenterRowProps {
    fraRolle?: RolleType;
    saksnummer: string;
    journalpost: IJournalpost;
    unselectDocument: (documents: IDokument) => void;
    selectDocument: (dokument: IDokument, toogle?: boolean) => void;
    selectedDocuments: IDokument[];
}
function JournalpostDokumenterRow({
    saksnummer,
    journalpost,
    selectDocument,
    fraRolle,
    selectedDocuments,
}: JournalpostDokumenterRowProps) {
    function onDocumentSelected() {
        const leggTilDokument: IDokument = {
            fraSaksnummer: saksnummer,
            journalpostId: journalpost.journalpostId,
            språk: journalpost.språk,
            dokumentmalId: journalpost.dokumenter[0].dokumentmalId,
            tittel: journalpost.innhold,
            fraRolle: fraRolle,
            lagret: false,
            dokumentDato: journalpost.dokumentDato,
            status: DokumentStatus.MÅ_KONTROLLERES,
            index: -1,
        };
        selectDocument(leggTilDokument);
    }
    const isSelected = selectedDocuments.some((d) => d.journalpostId == journalpost.journalpostId);

    let tittel = journalpost.dokumenter.length > 0 ? journalpost.dokumenter[0].tittel : journalpost.innhold;
    tittel = tittel != undefined || tittel.trim().length == 0 ? journalpost.innhold : tittel;
    const hasOnlyOneDocument = journalpost.dokumenter.length == 1;
    const renderTableRowContent = () => (
        <>
            <Table.DataCell style={{ width: "2%" }}>
                <Checkbox
                    hideLabel
                    checked={isSelected}
                    onChange={onDocumentSelected}
                    aria-labelledby={`id-${journalpost.journalpostId}`}
                >
                    {" "}
                </Checkbox>
            </Table.DataCell>
            <Table.DataCell style={{ width: "20%" }}>{tittel}</Table.DataCell>
            <Table.DataCell style={{ width: "5%" }}>
                {dayjs(journalpost.dokumentDato).format("DD.MM.YYYY")}
            </Table.DataCell>
            <Table.DataCell style={{ width: "5%" }}>
                {journalstatusToDisplayValue(journalpost.journalstatus)}
            </Table.DataCell>
            <Table.DataCell style={{ width: "5%" }}>{journalpost.dokumentType}</Table.DataCell>
            <Table.DataCell style={{ width: "5%" }}>{journalpost.gjelderAktor?.ident}</Table.DataCell>
            <Table.DataCell style={{ width: "2%" }}>
                <div className={"flex flex-row gap-1"}>
                    <OpenDokumentButton journalpostId={journalpost.journalpostId} status={journalpost.journalstatus} />
                </div>
            </Table.DataCell>
            {hasOnlyOneDocument && <Table.DataCell></Table.DataCell>}
        </>
    );
    if (hasOnlyOneDocument) {
        return (
            <Table.Row key={journalpost.journalpostId} selected={isSelected} className={"journalpost"}>
                {renderTableRowContent()}
            </Table.Row>
        );
    }
    return (
        <>
            <Table.ExpandableRow
                key={journalpost.journalpostId}
                selected={isSelected}
                className={"journalpost"}
                togglePlacement={"right"}
                content={
                    <div>
                        <Heading spacing size={"small"}>
                            Dokumenter
                        </Heading>
                        <ul>
                            {journalpost.dokumenter.map((dok, index) => (
                                <li>
                                    <div className={"flex flex-row gap-2 items-center"}>
                                        <BodyShort>{dok.tittel}</BodyShort>
                                        <OpenDokumentButton
                                            dokumentreferanse={dok.dokumentreferanse}
                                            journalpostId={journalpost.journalpostId}
                                            status={"FERDIGSTILT"}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                }
            >
                {renderTableRowContent()}
            </Table.ExpandableRow>
        </>
    );
}

function JournalpostDokumenterRowMultiDoc({
    saksnummer,
    journalpost,
    selectDocument,
    unselectDocument,
    fraRolle,
    selectedDocuments,
}: JournalpostDokumenterRowProps) {
    const [showAllDocuments, setShowAllDocuments] = useState(false);
    const { hentForsendelse } = useForsendelseApi();
    const forsendelse = hentForsendelse();
    const forsendelseDokumenter = forsendelse.dokumenter;

    function toggleShowAllDocuments() {
        setShowAllDocuments((s) => !s);
    }

    function onJournalpostSelected() {
        if (hasDocumentsAlreadyAddedToForsendelse || journalpost.erForsendelse) {
            journalpost.dokumenter.filter((d) => !erLagtTilIForsendelse(d)).forEach((d) => onDocumentSelected(d));
            return;
        }
        if (isAllDocumentsSelectedNotIncludingAdded && !isJournalpostSelected()) {
            journalpost.dokumenter.forEach((dok) =>
                unselectDocument({
                    journalpostId: journalpost.journalpostId,
                    dokumentreferanse: dok.dokumentreferanse,
                    lagret: false,
                    index: -1,
                    tittel: "",
                })
            );
        }
        const leggTilDokument: IDokument = {
            fraSaksnummer: saksnummer,
            journalpostId: journalpost.journalpostId,
            språk: journalpost.språk,
            dokumentmalId: journalpost.dokumenter[0].dokumentmalId,
            tittel: journalpost.innhold,
            fraRolle: fraRolle,
            lagret: false,
            dokumentDato: journalpost.dokumentDato,
            status: DokumentStatus.MÅ_KONTROLLERES,
            index: -1,
        };
        selectDocument(leggTilDokument);
    }

    function onDocumentSelected(dokumentDto: IDokumentJournalDto, toggle = true) {
        const leggTilDokument: IDokument = {
            fraSaksnummer: saksnummer,
            journalpostId: journalpost.journalpostId,
            dokumentreferanse: dokumentDto.dokumentreferanse,
            språk: journalpost.språk,
            tittel: dokumentDto.tittel,
            dokumentmalId: dokumentDto.dokumentmalId,
            fraRolle: fraRolle,
            dokumentDato: journalpost.dokumentDato,
            status: getForsendelseStatus(dokumentDto),
            lagret: false,
            index: -1,
        };
        selectDocument(leggTilDokument, toggle);
    }

    function getForsendelseStatus(dokumentDto: IDokumentJournalDto) {
        if (!journalpost.erForsendelse) return DokumentStatus.MÅ_KONTROLLERES;

        const erKopiAvEksternDokument =
            dokumentDto.originalDokumentreferanse != null || dokumentDto.originalJournalpostId != null;
        if (dokumentDto.status == "FERDIGSTILT") {
            return !erKopiAvEksternDokument ? DokumentStatus.FERDIGSTILT : DokumentStatus.KONTROLLERT;
        }
        return erKopiAvEksternDokument ? DokumentStatus.MÅ_KONTROLLERES : DokumentStatus.UNDER_REDIGERING;
    }

    const isJournalpostSelected = () => {
        return selectedDocuments.some(
            (d) => d.journalpostId == journalpost.journalpostId && d.dokumentreferanse == undefined
        );
    };
    const isDocumentSelectedNotIncludingAdded = (dokument: IDokumentJournalDto) => {
        return selectedDocuments.some((d) => d.dokumentreferanse == dokument.dokumentreferanse);
    };

    const isDocumentSelected = (dokument: IDokumentJournalDto) => {
        return (
            isDocumentSelectedNotIncludingAdded(dokument) || erLagtTilIForsendelse(dokument) || isJournalpostSelected()
        );
    };

    const erLagtTilIForsendelse = (dokument: IDokumentJournalDto) =>
        forsendelseDokumenter.some((forsendelseDokument) =>
            erSammeDokument(forsendelseDokument, dokument, journalpost.journalpostId)
        );
    const isAllDocumentsSelected = journalpost.dokumenter.every(isDocumentSelected);
    const isAllDocumentsSelectedNotIncludingAdded = journalpost.dokumenter.every(isDocumentSelectedNotIncludingAdded);
    const isSomeDocumentsSelected = journalpost.dokumenter.some(isDocumentSelected);
    const hasDocumentsAlreadyAddedToForsendelse = journalpost.dokumenter.some(erLagtTilIForsendelse);

    let tittel = journalpost.dokumenter.length > 0 ? journalpost.dokumenter[0].tittel : journalpost.innhold;
    tittel = tittel != undefined || tittel.trim().length == 0 ? journalpost.innhold : tittel;
    return (
        <>
            <Table.Row
                key={journalpost.journalpostId}
                selected={isAllDocumentsSelected}
                className={`journalpost journalpostrad ${showAllDocuments ? "open" : ""}`}
            >
                <Table.DataCell style={{ width: "2%" }}>
                    <Checkbox
                        hideLabel
                        checked={isAllDocumentsSelected}
                        indeterminate={isSomeDocumentsSelected && !isAllDocumentsSelected}
                        onChange={onJournalpostSelected}
                        aria-labelledby={`id-${journalpost.journalpostId}`}
                    >
                        {" "}
                    </Checkbox>
                </Table.DataCell>
                <Table.DataCell style={{ width: "20%" }}>{tittel}</Table.DataCell>
                <Table.DataCell style={{ width: "5%" }}>
                    {dayjs(journalpost.dokumentDato).format("DD.MM.YYYY")}
                </Table.DataCell>

                <Table.DataCell style={{ width: "5%" }}>{journalpost.dokumentType}</Table.DataCell>
                <Table.DataCell style={{ width: "5%" }}>{journalpost.gjelderAktor?.ident}</Table.DataCell>
                <Table.DataCell style={{ width: "5%" }}>
                    <JournalpostStatusTag status={journalpost.journalstatus} />
                </Table.DataCell>
                <Table.DataCell style={{ width: "2%" }}>
                    <div className={"flex flex-row gap-1"}>
                        <OpenDokumentButton
                            journalpostId={journalpost.journalpostId}
                            status={journalpost.journalstatus}
                        />
                    </div>
                </Table.DataCell>
                <Table.DataCell style={{ width: "2%" }}>
                    <Button
                        icon={showAllDocuments ? <Collapse /> : <Expand />}
                        size={"small"}
                        variant={"tertiary"}
                        onClick={toggleShowAllDocuments}
                    />
                </Table.DataCell>
            </Table.Row>
            <>
                {showAllDocuments && (
                    <>
                        {journalpost.dokumenter.map((dok, index) => (
                            <Table.Row
                                className={`dokumentrad ${index == journalpost.dokumenter.length - 1 ? "last" : ""}`}
                                key={index + dok.dokumentreferanse}
                                selected={isDocumentSelected(dok)}
                            >
                                <Table.DataCell>
                                    <Checkbox
                                        hideLabel
                                        checked={isDocumentSelected(dok)}
                                        onChange={() => {
                                            onDocumentSelected(dok, true);
                                        }}
                                        disabled={erLagtTilIForsendelse(dok)}
                                        aria-labelledby={`id-${journalpost.journalpostId}`}
                                        className={""}
                                    >
                                        {" "}
                                    </Checkbox>
                                </Table.DataCell>
                                <Table.DataCell colSpan={4}>{dok.tittel}</Table.DataCell>
                                <Table.DataCell colSpan={1}>
                                    <DokumentStatusTag status={getForsendelseStatus(dok)} />
                                </Table.DataCell>
                                <Table.DataCell colSpan={2}>
                                    <OpenDokumentButton
                                        dokumentreferanse={dok.dokumentreferanse}
                                        journalpostId={journalpost.journalpostId}
                                        status={dok.status}
                                    />
                                </Table.DataCell>
                            </Table.Row>
                        ))}
                    </>
                )}
            </>
        </>
    );
}

function erSammeDokument(forsendelseDokument: IDokument, dokumentJournal: IDokumentJournalDto, journalpostId: string) {
    const harReferanseTilDokument =
        forsendelseDokument.lenkeTilDokumentreferanse == dokumentJournal.dokumentreferanse &&
        forsendelseDokument.forsendelseId === journalpostId?.replace(/\D/g, "");

    const erSammeDokument =
        forsendelseDokument.originalDokumentreferanse == dokumentJournal.dokumentreferanse &&
        forsendelseDokument.originalJournalpostId?.replace(/\D/g, "") == journalpostId?.replace(/\D/g, "");

    console.debug("#######################");
    console.debug(
        "Dokument",
        "journalpostId",
        journalpostId,
        "dokumentreferanse",
        dokumentJournal.dokumentreferanse,
        "originalDokumentreferanse",
        dokumentJournal.originalDokumentreferanse,
        dokumentJournal.journalpostId,
        "originalJournalpostId",
        dokumentJournal.originalJournalpostId
    );
    console.debug(
        "Forsendelse",
        "dokref",
        forsendelseDokument.dokumentreferanse,
        "journalpostId",
        forsendelseDokument.journalpostId,
        "lenkeTilDokumentreferanse",
        forsendelseDokument.lenkeTilDokumentreferanse,
        "originalDokumentreferanse",
        forsendelseDokument.originalDokumentreferanse,
        "originalJournalpostId",
        forsendelseDokument.originalJournalpostId
    );
    console.debug("RESULT", harReferanseTilDokument || erSammeDokument);
    console.debug("#######################");

    return harReferanseTilDokument || erSammeDokument;
}
