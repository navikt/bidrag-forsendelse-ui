import { BodyShort, Button, Checkbox, Heading, Loader, Modal, Table } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { BIDRAG_FORSENDELSE_API } from "../../../api/api";
import { DokumentArkivSystemDto, JournalTema } from "../../../api/BidragForsendelseApi";
import GjelderSelect from "../../../components/detaljer/GjelderSelect";
import LanguageSelect from "../../../components/detaljer/LanguageSelect";
import DokumentStatusTag from "../../../components/dokument/DokumentStatusTag";
import { DokumentStatus } from "../../../constants/DokumentStatus";
import { useForsendelseApi } from "../../../hooks/useForsendelseApi";
import { IDokument } from "../../../types/Dokument";
import MottakerSelect from "../../opprettforsendelse/MottakerSelect";
import { useDokumenterForm } from "../context/DokumenterFormContext";
import { useSession } from "../context/SessionContext";
const OPPRETT_FORSENDELSE_MUTATION_KEY = "opprettForsendelse";

export default function KopierForsendelseButton() {
    const { addDocuments } = useDokumenterForm();
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div>
            <Button onClick={() => setModalOpen(true)} variant={"tertiary"} size={"small"}>
                Kopier forsendelse
            </Button>
            <KopierForsendelseModal
                open={modalOpen}
                onClose={(selectedDocuments) => {
                    selectedDocuments && addDocuments([selectedDocuments]);
                    setModalOpen(false);
                }}
            />
        </div>
    );
}

interface KopierForsendelseModalProps {
    onClose: (selectedDocument?: IDokument) => void;
    open: boolean;
}

interface DokumentRowData {
    dokumentreferanse: string;
    forsendelseId: string;
    tittel: string;
    status: DokumentStatus;
    selected: boolean;
}

interface KopierForsendelseFormProps {
    språk: string;
    gjelderIdent: string;
    mottakerIdent: string;
    dokumenter: DokumentRowData[];
}
function KopierForsendelseModal({ onClose, open }: KopierForsendelseModalProps) {
    const forsendelse = useForsendelseApi().hentForsendelse();
    const roller = useForsendelseApi().hentRoller();
    const navigate = useNavigate();
    const { forsendelseId, navigateToForsendelse } = useSession();
    const methods = useForm<KopierForsendelseFormProps>({
        defaultValues: {
            gjelderIdent: forsendelse.gjelderIdent,
            mottakerIdent: forsendelse.mottaker?.ident,
            språk: "NB",
            dokumenter: forsendelse.dokumenter.map((dokument) => ({
                dokumentreferanse: dokument.dokumentreferanse,
                forsendelseId: forsendelse.forsendelseId,
                tittel: dokument.tittel,
                status: dokument.status,
                selected: true,
            })),
        },
    });

    const opprettForsendelseFn = useMutation({
        mutationKey: OPPRETT_FORSENDELSE_MUTATION_KEY,
        mutationFn: (data: KopierForsendelseFormProps) =>
            BIDRAG_FORSENDELSE_API.api.opprettForsendelse({
                gjelderIdent: data.gjelderIdent,
                mottaker: {
                    ident: data.mottakerIdent,
                },
                saksnummer: forsendelse.saksnummer,
                behandlingInfo: {
                    ...forsendelse.behandlingInfo,
                },
                opprettTittel: true,
                enhet: forsendelse.enhet,
                tema: forsendelse.tema as JournalTema,
                språk: data.språk,
                dokumenter: [
                    {
                        tittel: "Forside",
                        dokumentmalId: "BI01S02",
                    },
                    ...data.dokumenter
                        .filter((d) => d.selected)
                        .map((d) => ({
                            tittel: d.tittel,
                            dokumentreferanse: d.dokumentreferanse,
                            journalpostId: forsendelse.forsendelseId,
                            arkivsystem: DokumentArkivSystemDto.BIDRAG,
                        })),
                ],
            }),
        onSuccess: (data) => {
            const forsendelseId = data.data.forsendelseId;
            onClose();
            navigateToForsendelse(forsendelseId?.toString(), data.data.forsendelseType);
            navigate(0);
        },
    });

    function onSubmit(data: KopierForsendelseFormProps) {
        console.log(data);
        opprettForsendelseFn.mutate(data);
    }
    useEffect(() => {
        Modal.setAppElement("#forsendelse-page");
    }, []);

    return (
        <FormProvider {...methods}>
            <Modal open={open} onClose={() => onClose()}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <Modal.Content
                        style={{
                            minWidth: "max-content",
                            minHeight: "max-content",
                            padding: "2rem 2rem",
                            overflowY: "auto",
                        }}
                    >
                        <Heading spacing level="1" size="large" id="modal-heading">
                            Kopier forsendelse
                        </Heading>
                        <BodyShort>
                            Opprett ny forsendelse med valgte dokumenter
                            <br />
                            Det vil bli opprettet en "Fritekstbrev" som forside i forsendelsen
                        </BodyShort>
                        <React.Suspense fallback={<Loader size={"medium"} />}>
                            <GjelderSelect roller={roller} />
                            <MottakerSelect />
                            <div className="w-max">
                                <LanguageSelect />
                            </div>
                            <Heading size="small">Kopier dokumenter</Heading>
                            <DokumentValgTable />
                        </React.Suspense>
                    </Modal.Content>
                    <Modal.Content>
                        <div className={"ml-2 flex flex-row gap-2 items-end bottom-2"}>
                            <Button size="small" type="submit" loading={opprettForsendelseFn.isLoading}>
                                Opprett
                            </Button>
                            <Button size="small" variant={"tertiary"} onClick={() => onClose()}>
                                Avbryt
                            </Button>
                        </div>
                    </Modal.Content>
                </form>
            </Modal>
        </FormProvider>
    );
}

function DokumentValgTable() {
    const { control } = useFormContext<KopierForsendelseFormProps>();
    const { fields, update } = useFieldArray<KopierForsendelseFormProps>({ control, name: "dokumenter" });
    const allSelected = fields.every((d) => d.selected);
    const someSelected = fields.some((d) => d.selected);
    return (
        <Table size="small">
            <Table.Header>
                <Table.Row>
                    <Table.DataCell>
                        <Checkbox
                            checked={allSelected}
                            indeterminate={someSelected && !allSelected}
                            size="small"
                            hideLabel
                            onChange={() => {
                                fields.forEach((d, index) => {
                                    update(index, { ...d, selected: allSelected ? false : true });
                                });
                            }}
                        >
                            Velg alle rader
                        </Checkbox>
                    </Table.DataCell>
                    <Table.HeaderCell>Tittel</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <DokumentValgTableRows rows={fields} update={update} />
        </Table>
    );
}

interface DokumentValgTableProps {
    rows: DokumentRowData[];
    update: (index: number, data: DokumentRowData) => void;
}
function DokumentValgTableRows({ rows, update }: DokumentValgTableProps) {
    return (
        <Table.Body>
            {rows.map((row, index) => (
                <Table.Row key={row.dokumentreferanse}>
                    <Table.DataCell width={"1%"}>
                        <Checkbox
                            size="small"
                            value={row.dokumentreferanse}
                            checked={row.selected}
                            onChange={() => {
                                console.log("ipdate", index, row.selected);
                                update(index, {
                                    ...row,
                                    selected: !row.selected,
                                });
                            }}
                        >
                            {""}
                        </Checkbox>
                    </Table.DataCell>
                    <Table.DataCell width="60%">{row.tittel}</Table.DataCell>
                    <Table.DataCell width="40%">
                        <DokumentStatusTag status={row.status} />
                    </Table.DataCell>
                </Table.Row>
            ))}
        </Table.Body>
    );
}
