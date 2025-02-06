import { FloppydiskIcon, InformationSquareIcon, PencilIcon, PlusIcon, TrashIcon } from "@navikt/aksel-icons";
import { dateToDDMMYYYYString } from "@navikt/bidrag-ui-common";
import { AddCircle } from "@navikt/ds-icons";
import {
    BodyShort,
    Box,
    Button,
    ExpansionCard,
    Heading,
    HStack,
    Label,
    Loader,
    Modal,
    Page,
    Select,
    Table,
    UNSAFE_Combobox,
    VStack,
} from "@navikt/ds-react";
import { useQueryClient } from "@tanstack/react-query";
import { Suspense, useMemo, useState } from "react";
import { FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form";

import {
    mapForsendelseResponse as varselForsendelseUpdater,
    mapVarselEttersendelse,
} from "../../../helpers/forsendelseHelpers";
import { useHentVedleggskoder } from "../../../hooks/kodeverkQueries";
import { useHentJournalInngående } from "../../../hooks/useDokumentApi";
import { UseForsendelseApiKeys, useHentForsendelseQuery } from "../../../hooks/useForsendelseApi";
import {
    useHentEksisterendeOppgaverForsendelse,
    useOppdaterVarselEttersendelse,
    useOpprettVarselEttersendelse,
    useSlettVarselEttersendelse,
    useSlettVarselEttersendelseDokument,
} from "../../../hooks/varselEnderselseApi";
import { IForsendelseFormProps } from "../context/DokumenterFormContext";
import { useSession } from "../context/SessionContext";
import { VarselDetaljer } from "./EttersendingsoppgaveDetaljer";
export const ettersendingsformPrefiks = "ettersendingsoppgave";

export default function OpprettEttersendelseOppgaveButton() {
    const [isOpen, setIsOpen] = useState(false);
    const forsendelse = useHentForsendelseQuery();
    const inngåendeJournalposter = useHentJournalInngående();

    if (inngåendeJournalposter.length === 0 && !forsendelse.ettersendingsoppgave) return;
    return (
        <>
            {forsendelse.ettersendingsoppgave ? (
                <EttersendelseOppgavePanel />
            ) : (
                <>
                    <Button variant="tertiary" size="small" icon={<PlusIcon />} onClick={() => setIsOpen(true)}>
                        Opprett ettersendingsoppgave
                    </Button>
                    <OpprettEttersendelseOppgaveModal isOpen={isOpen} setIsOpen={setIsOpen} />
                </>
            )}
        </>
    );
}

type FormProps = {
    journalpostId: string;
};
function OpprettEttersendelseOppgaveModal({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}) {
    const { forsendelseId } = useSession();
    const qc = useQueryClient();
    const { setValue } = useFormContext<IForsendelseFormProps>();
    const form = useForm<FormProps>({});
    const opprettVarselEttersendelseFn = useOpprettVarselEttersendelse();
    const inngåendeJournalposter = useHentJournalInngående();

    function opprett(data: FormProps) {
        const journalpost = inngåendeJournalposter.find((jp) => jp.journalpostId === data.journalpostId);

        opprettVarselEttersendelseFn
            .mutateAsync({
                forsendelseId: Number(forsendelseId.replace("BIF-", "")),
                tittel: journalpost?.innhold,
                ettersendelseForJournalpostId: data.journalpostId,
                skjemaId: journalpost.brevkode.kode,
            })
            .then(async (opprettetVarselEttersendelse) => {
                setValue("ettersendingsoppgave", mapVarselEttersendelse(opprettetVarselEttersendelse.data));
                qc.setQueryData(
                    UseForsendelseApiKeys.hentForsendelse(),
                    varselForsendelseUpdater(opprettetVarselEttersendelse.data)
                );
                setIsOpen(false);
            });
    }
    return (
        <form onSubmit={form.handleSubmit(opprett)}>
            <Modal open={isOpen} aria-label="" closeOnBackdropClick onClose={() => setIsOpen(false)} className="w-full">
                <Modal.Header closeButton>
                    <Heading size="medium">Opprett ettersendingsoppgave</Heading>
                </Modal.Header>
                <Modal.Body>
                    <FormProvider {...form}>
                        <EksisterendeOppgaveVarsel />
                        <VarselForJournalpostSelect />
                    </FormProvider>
                </Modal.Body>
                <Modal.Footer>
                    <Button size="small">Opprett</Button>
                </Modal.Footer>
            </Modal>
        </form>
    );
}

function EttersendelseOppgavePanel() {
    useHentVedleggskoder();
    return (
        <Page.Block className="pb-4">
            <HStack gap="2" className="pb-4">
                <Heading className="self-center" size="medium">
                    Ettersendingsoppgave
                </Heading>
                <SlettOppgaveButton />
            </HStack>
            <EksisterendeOppgaveVarsel />
            <VStack gap="2" className="max-w-[95vw] w-[1000px]">
                <VarselDetaljer />
                <Box>
                    <Heading size="xsmall">Vedleggsliste</Heading>
                    <EttersendingsoppgaveVedleggsliste />
                </Box>
            </VStack>
        </Page.Block>
    );
}

function SlettOppgaveButton() {
    const [open, setOpen] = useState(false);
    const qc = useQueryClient();
    const forsendelse = useHentForsendelseQuery();
    const slettVarselEttersendelseFn = useSlettVarselEttersendelse();
    function slettVarsel() {
        slettVarselEttersendelseFn
            .mutateAsync({
                forsendelseId: Number(forsendelse.forsendelseId.replace("BIF-", "")),
            })
            .then(() => {
                qc.refetchQueries({ queryKey: UseForsendelseApiKeys.hentForsendelse() });
            });
    }

    return (
        <>
            <Button
                variant="tertiary"
                type="button"
                size="xsmall"
                className="w-fit"
                icon={<TrashIcon />}
                onClick={() => setOpen(true)}
            >
                Slett
            </Button>
            <Modal aria-label="" open={open} onClose={() => setOpen(false)}>
                <Modal.Header closeButton>
                    <Heading size="medium">Slett oppgave</Heading>
                </Modal.Header>
                <Modal.Body>
                    <BodyShort>Er du sikker på at du vil slette oppgaven?</BodyShort>
                    <BodyShort>Ettersendingsoppgave vil ikke bli opprettet for søknaden</BodyShort>
                </Modal.Body>
                <Modal.Footer>
                    <Button size="xsmall" variant="danger" onClick={slettVarsel}>
                        Slett
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
function EttersendingsoppgaveVedleggsliste() {
    const forsendelse = useHentForsendelseQuery();
    const { control, getValues, setError, reset, setValue } = useFormContext<IForsendelseFormProps>();
    const vedleggsliste = useFieldArray({ control, name: `${ettersendingsformPrefiks}.vedleggsliste` });
    const [editableRow, setEditableRow] = useState<number>(undefined);

    const oppdaterEttersendingsoppgaveFn = useOppdaterVarselEttersendelse();
    const slettVarselEttersendelseDokumentFn = useSlettVarselEttersendelseDokument();
    function onSaveRow(index: number) {
        const vedlegg = getValues(`${ettersendingsformPrefiks}.vedleggsliste.${index}`);
        if (vedlegg.tittel.length === 0) {
            setError(`${ettersendingsformPrefiks}.vedleggsliste.${index}.tittel`, {
                message: "Tittel kan ikke være tom",
            });
            return;
        }
        oppdaterEttersendingsoppgaveFn
            .mutateAsync({
                forsendelseId: Number(forsendelse.forsendelseId.replace("BIF-", "")),
                oppdaterDokument: {
                    id: vedlegg.varselDokumentId,
                    tittel: vedlegg.tittel,
                    skjemaId: vedlegg.skjemaId,
                },
            })
            .then((response) => {
                setEditableRow(undefined);
                vedleggsliste.replace(
                    response.data.vedleggsliste.map((d) => ({
                        ...d,
                        varselDokumentId: d.id,
                        type: d.skjemaId ? "SKJEMA" : "FRITEKST",
                    }))
                );
                reset(undefined, { keepValues: true, keepDirty: false });
            });
    }
    function onDeleteRow(index: number) {
        setEditableRow(undefined);

        const dokument = getValues(`${ettersendingsformPrefiks}.vedleggsliste.${index}`);
        if (dokument.varselDokumentId === undefined) {
            vedleggsliste.remove(index);
            return;
        }
        slettVarselEttersendelseDokumentFn
            .mutateAsync({
                forsendelseId: Number(forsendelse.forsendelseId.replace("BIF-", "")),
                id: dokument.varselDokumentId,
            })
            .then(() => {
                vedleggsliste.remove(index);
            });
    }

    function addDokument() {
        vedleggsliste.append({ tittel: "" });
        setEditableRow(vedleggsliste.fields.length);
    }
    return (
        <Box>
            <HStack>
                <Button
                    variant="tertiary"
                    type="button"
                    size="xsmall"
                    className="w-fit mb-2 mt-2"
                    icon={<AddCircle />}
                    onClick={addDokument}
                >
                    Legg til vedlegg
                </Button>
            </HStack>
            {vedleggsliste.fields.length > 0 && (
                <Table size="small">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell textSize="small"></Table.HeaderCell>
                            {/* <Table.HeaderCell textSize="small" className="w-[150px]"></Table.HeaderCell> */}
                            <Table.HeaderCell textSize="small" className="w-[5px]"></Table.HeaderCell>
                            <Table.HeaderCell textSize="small" className="w-[5px]"></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {vedleggsliste.fields.map((dokument, index) => (
                            <Table.Row shadeOnHover={false} key={dokument.id + "_" + index}>
                                <Table.DataCell textSize="small">
                                    {editableRow == index ? (
                                        <Suspense fallback={<Loader size="xsmall" />}>
                                            <NavSkjemaSelect2 index={index} />
                                        </Suspense>
                                    ) : (
                                        <span>{dokument.tittel}</span>
                                    )}
                                </Table.DataCell>
                                {/* <Table.DataCell textSize="small">{dokument.skjemaId ?? "Annen"}</Table.DataCell> */}
                                <Table.DataCell textSize="small">
                                    <EditOrSaveButton
                                        index={index}
                                        editableRow={editableRow == index}
                                        onSaveRow={onSaveRow}
                                        onEditRow={() => {
                                            if (editableRow === undefined) {
                                                setEditableRow(index);
                                                setValue(
                                                    `${ettersendingsformPrefiks}.vedleggsliste.${index}`,
                                                    dokument,
                                                    {
                                                        shouldDirty: true,
                                                    }
                                                );
                                            }
                                        }}
                                    />
                                </Table.DataCell>
                                <Table.DataCell textSize="small">
                                    <Button
                                        size="small"
                                        variant="tertiary"
                                        icon={<TrashIcon />}
                                        onClick={() => onDeleteRow(index)}
                                    />
                                </Table.DataCell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            )}
        </Box>
    );
}
export function VarselForJournalpostSelect({ hideLabel = false, prefiks }: { hideLabel?: boolean; prefiks?: string }) {
    const inngåendeJournalposter = useHentJournalInngående();
    const form = useFormContext();

    return (
        <>
            <Select
                hideLabel={hideLabel}
                label="Velg søknad"
                size="small"
                {...form.register(`${prefiks ? `${ettersendingsformPrefiks}.journalpostId` : "journalpostId"}`)}
            >
                {inngåendeJournalposter
                    .sort((a, b) => a.dokumentDato.localeCompare(b.dokumentDato))
                    .map((journalpost) => {
                        return (
                            <option key={journalpost.journalpostId} value={journalpost.journalpostId}>
                                {journalpost.innhold} ({dateToDDMMYYYYString(new Date(journalpost.dokumentDato))})
                            </option>
                        );
                    })}
            </Select>
        </>
    );
}

function EksisterendeOppgaveVarsel() {
    const eksisterendeOppgaverMap = useHentEksisterendeOppgaverForsendelse();
    const eksisterendeOppgaver = useMemo(() => {
        return Object.values(eksisterendeOppgaverMap).flat();
    }, [eksisterendeOppgaverMap]);

    if (eksisterendeOppgaver.length == 0) return null;

    return (
        <ExpansionCard size="small" aria-label="" className="subtle-card w-[500px] mb-2">
            <ExpansionCard.Header>
                <HStack wrap={false} gap="2" align="center">
                    <div>
                        <InformationSquareIcon aria-hidden />
                    </div>
                    <div>
                        <ExpansionCard.Title size="small">
                            Bruker har{" "}
                            {eksisterendeOppgaver.length > 1
                                ? "flere ettersendingsoppgaver"
                                : "en ettersendingsoppgave"}
                        </ExpansionCard.Title>
                        <ExpansionCard.Description>
                            Dette vil opprette ny ettersendingsoppgave for bruker
                        </ExpansionCard.Description>
                    </div>
                </HStack>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                {eksisterendeOppgaver.map((oppgave, index) => {
                    return (
                        <div
                            className={`${index != eksisterendeOppgaver.length - 1 ? "border-0 border-b border-solid border-border-subtle" : ""} pt-2`}
                        >
                            <Label as="p" size="small">
                                Tittel
                            </Label>
                            <BodyShort size="small" spacing>
                                {oppgave.tittel}
                            </BodyShort>
                            <Label as="p" size="small">
                                Vedleggsliste
                            </Label>
                            <dl className="flex gap-1 flex-col mt-0">
                                {oppgave.vedleggsListe.map((vedlegg) => {
                                    return (
                                        <dt className="border-0 border-b border-solid border-border-default">
                                            {vedlegg.tittel}
                                        </dt>
                                    );
                                })}
                            </dl>
                        </div>
                    );
                })}

                <style>{`
        .subtle-card {
          --ac-expansioncard-bg: var(--a-deepblue-50);
          --ac-expansioncard-border-open-color: var(--a-border-alt-3);
          --ac-expansioncard-border-hover-color: var(--a-border-alt-3);
        }`}</style>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
}

function NavSkjemaSelect2({ hideLabel = true, index }: { hideLabel?: boolean; index: number }) {
    const bidragSkjemaer = useHentVedleggskoder();
    const form = useFormContext<IForsendelseFormProps>();

    return (
        <UNSAFE_Combobox
            hideLabel={hideLabel}
            label="Velg skjema"
            allowNewValues
            size="small"
            error={form.formState.errors?.dokumenter?.[index]?.tittel?.message}
            defaultValue={form.getValues(`${ettersendingsformPrefiks}.vedleggsliste.${index}.tittel`)}
            onChange={() => {
                return null;
            }}
            options={bidragSkjemaer.map((skjema) => ({
                label: skjema.beskrivelse,
                value: skjema.kode,
            }))}
            onToggleSelected={(value) => {
                const skjema = bidragSkjemaer.find((skjema) => skjema.kode === value);
                form.setValue(`${ettersendingsformPrefiks}.vedleggsliste.${index}.skjemaId`, skjema?.kode ?? "N6");
                form.setValue(
                    `${ettersendingsformPrefiks}.vedleggsliste.${index}.tittel`,
                    skjema?.beskrivelse ?? value
                );
            }}
        ></UNSAFE_Combobox>
    );
}
export const EditOrSaveButton = ({
    index,
    editableRow,
    onSaveRow,
    onEditRow,
}: {
    index: number;
    editableRow: boolean;
    onSaveRow: (index: number) => void;
    onEditRow: (index: number) => void;
}) => {
    return editableRow ? (
        <Button
            type="button"
            onClick={() => onSaveRow(index)}
            icon={<FloppydiskIcon aria-hidden />}
            variant="tertiary"
            size="xsmall"
        ></Button>
    ) : (
        <Button
            type="button"
            onClick={() => onEditRow(index)}
            icon={<PencilIcon aria-hidden />}
            variant="tertiary"
            size="xsmall"
        ></Button>
    );
};
