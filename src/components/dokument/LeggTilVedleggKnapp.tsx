import { Add } from "@navikt/ds-icons";
import { Button, Heading, Loader, Modal, Select } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import React from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import { DokumentMalDetaljerInnholdTypeEnum } from "../../api/BidragForsendelseApi";
import { DokumentStatus } from "../../constants/DokumentStatus";
import { useForsendelseApi } from "../../hooks/useForsendelseApi";
import { useDokumenterForm } from "../../pages/forsendelse/context/DokumenterFormContext";
import { IDokument } from "../../types/Dokument";
import { cleanupAfterClosedModal } from "../../utils/ModalUtils";

export default function LeggTilVedleggKnapp() {
    const { addDocuments } = useDokumenterForm();
    const [modalOpen, setModalOpen] = useState(false);
    const { data: vedleggListe } = useForsendelseApi().vedleggListe();

    const closeModal = () => {
        setModalOpen(false);
        cleanupAfterClosedModal();
    };
    if (vedleggListe.length == 0) {
        return null;
    }
    return (
        <div>
            <Button onClick={() => setModalOpen(true)} variant={"tertiary"} size={"small"} icon={<Add />}>
                Legg til vedlegg
            </Button>
            {modalOpen && (
                <LeggTilVedlegglModal
                    open={modalOpen}
                    onClose={(selectedDocuments) => {
                        selectedDocuments && addDocuments([selectedDocuments]);
                        closeModal();
                    }}
                />
            )}
        </div>
    );
}
interface LeggTilDokumentFraSakModalProps {
    onClose: (selectedDocument?: IDokument) => void;
    open: boolean;
}

interface OpprettDokumentFraMalFormProps {
    dokument: {
        malId: string;
        tittel: string;
        type: "UTGÅENDE" | "NOTAT";
    };
}
function LeggTilVedlegglModal({ onClose, open }: LeggTilDokumentFraSakModalProps) {
    const methods = useForm<OpprettDokumentFraMalFormProps>();

    function onSubmit(data: OpprettDokumentFraMalFormProps) {
        if (data.dokument) {
            onClose({
                dokumentmalId: data.dokument.malId,
                tittel: data.dokument.tittel,
                status: DokumentStatus.IKKE_BESTILT,
                index: -1,
                lagret: false,
            });
        }
    }
    useEffect(() => {
        Modal.setAppElement("#forsendelse-page");
    }, []);

    return (
        <FormProvider {...methods}>
            <Modal open={open} onClose={() => onClose()}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="mb-0">
                    <Modal.Content
                        style={{
                            minWidth: "max-content",
                            minHeight: "max-content",
                        }}
                    >
                        <Heading spacing level="1" size="large" id="modal-heading">
                            Legg til vedlegg
                        </Heading>
                        <React.Suspense fallback={<Loader size={"medium"} />}>
                            <DokumentValgVedlegg />
                        </React.Suspense>
                    </Modal.Content>
                    <Modal.Content>
                        <div className={"ml-2 flex flex-row gap-2 items-end"}>
                            <Button size="small" type="submit">
                                Legg til
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

interface SelectOptionData {
    malId: string;
    tittel: string;
    beskrivelse: string;
    språk: string;
    innholdType: DokumentMalDetaljerInnholdTypeEnum;
}

export interface DokumentFormProps {
    malId: string;
    tittel: string;
}

function DokumentValgVedlegg() {
    const { data: vedleggListe } = useForsendelseApi().vedleggListe();
    const {
        register,
        setValue,
        formState: { errors },
        resetField,
    } = useFormContext<{
        dokument: DokumentFormProps;
    }>();

    function getAllOptions(): Record<string, SelectOptionData[]> {
        const tableData = vedleggListe.map((vedlegg) => ({
            malId: vedlegg.malId,
            beskrivelse: vedlegg.detaljer.beskrivelse,
            tittel: vedlegg.detaljer.beskrivelse,
            innholdType: vedlegg.detaljer.innholdType,
            språk: vedlegg.detaljer.språk.length > 0 ? vedlegg.detaljer.språk[0] : "NB",
        }));

        const rowData: Record<string, SelectOptionData[]> = {};

        tableData.forEach((data) => {
            if (!rowData[data.innholdType]) {
                rowData[data.innholdType] = [];
            }

            rowData[data.innholdType].push(data);
        });

        return rowData;
    }

    function onSelectionChange(malId: string) {
        const dokument = vedleggListe.find((d) => d.malId == malId);
        if (dokument) {
            const beskrivelse = dokument.detaljer.beskrivelse;
            const erNorsk = dokument.detaljer.språk.length == 0 || dokument.detaljer.språk.includes("NB");
            const tittel = erNorsk ? dokument.detaljer.tittel : `${dokument.detaljer.tittel} (${beskrivelse})`;
            setValue("dokument", {
                malId,
                tittel,
            });
        } else {
            resetField("dokument");
        }
    }
    register("dokument", {
        validate: (dok) => {
            if (dok?.malId == null) return "Dokument må velges";
            if (dok?.tittel == null || dok.tittel.trim().length == 0) return "Tittel på dokumentet kan ikke være tom";
            return true;
        },
    });

    function innholdTypeTilVisningsnavn(innholdType: DokumentMalDetaljerInnholdTypeEnum): string {
        switch (innholdType) {
            case DokumentMalDetaljerInnholdTypeEnum.SKJEMA:
                return "Skjema";
            case DokumentMalDetaljerInnholdTypeEnum.VARSEL:
                return "Varsel";
            case DokumentMalDetaljerInnholdTypeEnum.VEDLEGG_VARSEL:
                return "Vedlegg til varselbrev";
            case DokumentMalDetaljerInnholdTypeEnum.VEDLEGG_VEDTAK:
                return "Vedlegg til vedtakbrev";
            case DokumentMalDetaljerInnholdTypeEnum.VEDTAK:
                return "Vedtak";
        }
        return innholdType;
    }
    const options = getAllOptions();

    function mapToBeskrivelse(option: SelectOptionData) {
        if (option.språk == "NB") return option.beskrivelse;
        return `${option.beskrivelse} (${option.språk})`;
    }
    return (
        <div className="w-100">
            <Select
                label="Velg dokument"
                size="small"
                onChange={(ev) => onSelectionChange(ev.target.value)}
                error={errors.dokument?.message}
            >
                <option value="">Velg dokument</option>
                {Object.keys(options).map((innholdType) => {
                    const dokumentListe = options[innholdType];
                    return (
                        <optgroup label={innholdTypeTilVisningsnavn(innholdType as DokumentMalDetaljerInnholdTypeEnum)}>
                            {dokumentListe
                                .map((opt) => ({
                                    ...opt,
                                    beskrivelse: mapToBeskrivelse(opt),
                                }))
                                .sort((a, b) => (b.språk == "NB" ? 1 : a.beskrivelse.localeCompare(b.beskrivelse)))
                                .map((dokument) => (
                                    <option value={dokument.malId}>{dokument.beskrivelse}</option>
                                ))}
                        </optgroup>
                    );
                })}
            </Select>
        </div>
    );
}
