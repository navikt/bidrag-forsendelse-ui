import ObjectUtils from "@navikt/bidrag-ui-common/esm/utils/ObjectUtils";
import { Alert, BodyShort, Button, ConfirmationPanel, Loader } from "@navikt/ds-react";
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
import { hasOnlyNullValues } from "../../../utils/ObjectUtils";
import { RedirectTo } from "../../../utils/RedirectUtils";
import BestillDistribusjonInfo from "./BestillDistribusjonInfo";

interface BestillDistribusjonModalProps {
    onCancel: () => void;
}
export default function BestillDistribusjonModal({ onCancel }: BestillDistribusjonModalProps) {
    const [submitState, setSubmitState] = useState<
        "pending" | "idle" | "succesfull" | "succesfull_no_distribution" | "error"
    >("idle");
    const [onEditMode, setOnEditMode] = useState<boolean>(false);
    const [loadingData, setLoadingData] = useState<boolean>(true);
    const [error, setError] = useState<string>();
    const [adresse, setAdresse] = useState<DistribuerTilAdresse | undefined>();
    const forsendelse = useForsendelseApi().hentForsendelse();
    const postnummere = hentPostnummere();
    const ident = forsendelse.mottaker.ident;
    const mottaker = forsendelse.mottaker;
    const harAdresse = adresse != undefined && adresse != null;
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
                const response = await PERSON_API.adresse.hentPersonPostadresse({ personident: "" }, { ident });
                return response?.status == 204 ? null : response?.data;
            }
        },
        onSuccess: (adresse) => {
            const erTomAdresse = ObjectUtils.isEmpty(adresse) || hasOnlyNullValues(adresse);
            return erTomAdresse ? null : adresse;
        },
        suspense: false,
    });

    useEffect(() => {
        if (personAdresseQuery.status == "success") {
            const adresseResponse = personAdresseQuery.data;
            setLoadingData(false);
            // @ts-ignore
            setAdresse(adresseResponse);
        }
    }, [personAdresseQuery.status]);

    const distribuerMutation = useMutation({
        mutationFn: async ({ ingenDistribusjon }: { ingenDistribusjon?: boolean }) => {
            const request: DistribuerJournalpostRequest = {
                lokalUtskrift: false,
                adresse: adresse,
            };
            await BIDRAG_FORSENDELSE_API.api.distribuerForsendelse(forsendelse.forsendelseId, request, {
                ingenDistribusjon,
            });
            return ingenDistribusjon ? false : true;
        },
        onSuccess: (distribuert: boolean) => {
            setSubmitState(distribuert ? "succesfull" : "succesfull_no_distribution");
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

    function onSubmit(trengerAdresseForDistribusjon: boolean, ingenDistribusjon?: boolean) {
        if (trengerAdresseForDistribusjon && !adresse && !ingenDistribusjon) {
            setError("Adresse må settes før distribusjon");
            setSubmitState("error");
            return;
        }

        setError(null);
        setSubmitState("pending");
        distribuerMutation.mutate({ ingenDistribusjon });
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
                        editable={submitState === "idle" || submitState == "error"}
                        onEditModeChanged={setOnEditMode}
                        onAdresseChanged={setAdresse}
                    />
                </React.Suspense>
                <React.Suspense fallback={<div />}>
                    <DistribusjonKnapper
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        harAdresse={harAdresse}
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
            onCancel={(e) => {
                if (submitState === "pending") e.preventDefault();
            }}
            header={{
                heading: "Bestill distribusjon av forsendelse",
            }}
        >
            <Modal.Body>
                {error && (
                    <Alert variant="error" className={"mt-2"}>
                        <BodyShort>{error}</BodyShort>
                    </Alert>
                )}
                {submitState === "succesfull" && (
                    <Alert variant="success" className={"mt-2"}>
                        <BodyShort>Distribusjon bestilt. Åpner sakshistorikk</BodyShort>
                    </Alert>
                )}
                {submitState === "succesfull_no_distribution" && (
                    <Alert variant="success" className={"mt-2"}>
                        <BodyShort>Forsendelse markert som ikke distribuert. Åpner sakshistorikk</BodyShort>
                    </Alert>
                )}
                <div className={"min-w-[35rem] relative px-2 w-full max-w-3xl h-full md:h-auto"}>
                    {renderModalBody()}
                </div>
            </Modal.Body>
        </Modal>
    );
}

interface DistribusjonKnapperProps {
    onSubmit: (trengerAdresseForDistribusjon: boolean, ingenDistribusjon?: boolean) => void;
    onCancel: () => void;
    harAdresse: boolean;
    submitButtonDisabled: boolean;
    cancelButtonDisabled: boolean;
    loading: boolean;
}
function DistribusjonKnapper({
    onSubmit,
    onCancel,
    harAdresse,
    cancelButtonDisabled,
    loading,
    submitButtonDisabled,
}: DistribusjonKnapperProps) {
    const [ingenDistribusjon, setIngenDistribusjon] = useState(false);
    const distribusjonKanal = useDokumentApi().distribusjonKanal();
    const trengerAdresseForDistribusjon =
        distribusjonKanal.distribusjonskanal == BestemKanalResponseDistribusjonskanalEnum.PRINT;
    useEffect(() => {
        if (harAdresse) setIngenDistribusjon(false);
    }, [harAdresse]);
    function renderIngenDistribusjonChoice() {
        if (harAdresse) return null;
        if (!trengerAdresseForDistribusjon) return null;
        return (
            <ConfirmationPanel
                size="small"
                className="mb-2"
                checked={ingenDistribusjon}
                label="Mottaker mangler adresse. Ferdigstill forsendelsen uten distribusjon."
                onChange={() => setIngenDistribusjon((x) => !x)}
            >
                Fant ingen postadresse til mottaker. Når adressen ikke er tilgjengelig, kan du ferdigstille forsendelsen
                uten å distribuere den til mottaker.
            </ConfirmationPanel>
        );
    }
    return (
        <div className="flex flex-col">
            {renderIngenDistribusjonChoice()}
            <div className="flex items-center space-x-2">
                <Button
                    variant={"primary"}
                    onClick={() => onSubmit(trengerAdresseForDistribusjon, ingenDistribusjon)}
                    size="small"
                    loading={loading}
                    disabled={submitButtonDisabled}
                >
                    {ingenDistribusjon
                        ? "Bekreft uten distribusjon og gå tilbake til sakshistorikk"
                        : "Bekreft og gå tilbake til sakshistorikk"}
                </Button>
                <Button size="small" variant={"secondary"} disabled={cancelButtonDisabled} onClick={onCancel}>
                    Avbryt
                </Button>
            </div>
        </div>
    );
}
