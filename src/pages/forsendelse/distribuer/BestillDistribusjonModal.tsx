import { Alert, BodyShort, Button, Heading, Loader } from "@navikt/ds-react";
import { Modal } from "@navikt/ds-react";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { useQuery } from "react-query";

import { BIDRAG_FORSENDELSE_API } from "../../../api/api";
import { PERSON_API } from "../../../api/api";
import { DistribuerTilAdresse } from "../../../api/BidragDokumentApi";
import { BestemKanalResponseDistribusjonskanalEnum } from "../../../api/BidragDokumentArkivApi";
import { DistribuerJournalpostRequest } from "../../../api/BidragForsendelseApi";
import { hentPostnummere } from "../../../api/queries";
import useDokumentApi from "../../../hooks/useDokumentApi";
import { useForsendelseApi } from "../../../hooks/useForsendelseApi";
import { RedirectTo } from "../../../utils/RedirectUtils";
import BestillDistribusjonInfo from "./BestillDistribusjonInfo";

interface BestillDistribusjonModalProps {
    onCancel: () => void;
}
export default function BestillDistribusjonModal({ onCancel }: BestillDistribusjonModalProps) {
    const [submitState, setSubmitState] = useState<"pending" | "idle" | "succesfull" | "error">("idle");
    const [onEditMode, setOnEditMode] = useState<boolean>(false);
    const [loadingData, setLoadingData] = useState<boolean>(true);
    const [error, setError] = useState<string>();
    const [adresse, setAdresse] = useState<DistribuerTilAdresse>();
    const forsendelse = useForsendelseApi().hentForsendelse();
    const postnummere = hentPostnummere();
    const ident = forsendelse.mottaker.ident;
    const mottaker = forsendelse.mottaker;

    const personAdresseQuery = useQuery({
        queryKey: `person_adresse_${ident}`,
        queryFn: async () => {
            if (mottaker.adresse) {
                const adresse = { ...mottaker.adresse, land: mottaker.adresse.landkode };
                const manglerPoststed = adresse.landkode == "NO" && adresse.postnummer && !adresse.poststed;
                if (manglerPoststed) {
                    adresse.poststed = getPoststedByPostnummer(adresse.postnummer);
                }
                return adresse;
            } else {
                return (await PERSON_API.adresse.hentPersonPostadresse({ personident: "" }, { ident }))?.data;
            }
        },
        suspense: false,
    });

    useEffect(() => {
        if (personAdresseQuery.status == "success") {
            const adresseResponse = personAdresseQuery.data;
            setLoadingData(false);
            setAdresse({
                ...adresseResponse,
                adresselinje1: adresseResponse.adresselinje1 ?? "",
            });
        }
    }, [personAdresseQuery.status]);

    const distribuerMutation = useMutation({
        mutationFn: () => {
            const request: DistribuerJournalpostRequest = {
                lokalUtskrift: false,
                adresse: adresse,
            };
            return BIDRAG_FORSENDELSE_API.api.distribuerForsendelse(forsendelse.forsendelseId, request);
        },
        onSuccess: () => {
            setSubmitState("succesfull");
            RedirectTo.sakshistorikk(forsendelse.saksnummer);
        },
        onError: () => {
            setError("Det skjedde en feil ved bestilling av distribusjon. Vennligst prøv på nytt.");
            setSubmitState("error");
        },
    });
    function getPoststedByPostnummer(postnummer?: string) {
        if (!postnummer) {
            return undefined;
        }
        const postnummerValue = postnummere.find((value) => Object.keys(value)[0] === postnummer);
        return postnummerValue ? postnummerValue[postnummer] : undefined;
    }

    function onSubmit() {
        if (!adresse) {
            setError("Adresse må settes før distribusjon");
            setSubmitState("error");
            return;
        }

        setError(null);
        setSubmitState("pending");
        distribuerMutation.mutate();
    }

    function renderModalBody() {
        if (loadingData) {
            return <Loader size={"medium"} />;
        }

        const submitButtonDisabled = submitState === "pending" || submitState === "succesfull" || onEditMode;
        const cancelButtonDisabled = submitState === "pending" || submitState === "succesfull";
        return (
            <>
                <React.Suspense fallback={<Loader variant="neutral" size="small" />}>
                    <BestillDistribusjonInfo
                        adresse={adresse}
                        editable={submitState === "idle"}
                        onEditModeChanged={setOnEditMode}
                        onAdresseChanged={setAdresse}
                    />
                </React.Suspense>
                <React.Suspense fallback={<div />}>
                    <DistribusjonKnapper
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        loading={submitState === "pending"}
                        submitButtonDisabled={submitButtonDisabled}
                        cancelButtonDisabled={cancelButtonDisabled}
                    />
                </React.Suspense>
            </>
        );
    }

    return (
        <Modal
            className="bestill-distribusjon-modal"
            open
            onClose={onCancel}
            closeButton={true}
            shouldCloseOnOverlayClick={false}
        >
            <Modal.Content>
                <Heading size={"large"}>Bestill distribusjon av forsendelse</Heading>
                {error && (
                    <Alert variant="error" className={"mt-2"}>
                        <BodyShort>{error}</BodyShort>
                    </Alert>
                )}
                {!adresse && !loadingData && (
                    <Alert variant="warning" className={"mt-2"}>
                        <BodyShort>Fant ingen adresse for mottaker {mottaker.ident}</BodyShort>
                    </Alert>
                )}
                {submitState === "succesfull" && (
                    <Alert variant="success" className={"mt-2"}>
                        <BodyShort>Distribusjon bestilt. Åpner sakshistorikk</BodyShort>
                    </Alert>
                )}
                <div className={"min-w-[35rem] relative px-2 w-full max-w-3xl h-full md:h-auto"}>
                    {renderModalBody()}
                </div>
            </Modal.Content>
        </Modal>
    );
}

interface DistribusjonKnapperProps {
    onSubmit: () => void;
    onCancel: () => void;
    submitButtonDisabled: boolean;
    cancelButtonDisabled: boolean;
    loading: boolean;
}
function DistribusjonKnapper({
    onSubmit,
    onCancel,
    cancelButtonDisabled,
    loading,
    submitButtonDisabled,
}: DistribusjonKnapperProps) {
    const distribusjonKanal = useDokumentApi().distribusjonKanal();
    const størrelseIMb = useForsendelseApi().hentStørrelseIMb();
    function kanDistribuere(): { result: boolean; reason?: string } {
        const distribusjonViaSDP =
            distribusjonKanal.distribusjonskanal == BestemKanalResponseDistribusjonskanalEnum.SDP;
        if (distribusjonViaSDP && størrelseIMb >= 29.5) {
            return {
                result: false,
                reason: "Kan ikke distribuere store forsendelser via digital postkasse akkurat nå. Det jobbes med en løsning og vil være klar om dager.",
            };
        }
        return {
            result: true,
        };
    }
    const kanDistribuereResult = kanDistribuere();
    if (!kanDistribuereResult.result) {
        return (
            <Alert size="small" variant="warning">
                {kanDistribuereResult.reason}
            </Alert>
        );
    }
    return (
        <div className="flex items-center space-x-2">
            <Button
                variant={"primary"}
                onClick={onSubmit}
                size="small"
                loading={loading}
                disabled={submitButtonDisabled}
            >
                Bekreft og gå tilbake til sakshistorikk
            </Button>
            <Button size="small" variant={"secondary"} disabled={cancelButtonDisabled} onClick={onCancel}>
                Avbryt
            </Button>
        </div>
    );
}
