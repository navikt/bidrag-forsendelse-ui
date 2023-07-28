import { BodyShort } from "@navikt/ds-react";
import React from "react";

import { DistribuerTilAdresse } from "../api/BidragDokumentApi";
import { MottakerAdresseTo } from "../api/BidragForsendelseApi";
import { countryCodeToName } from "../utils/AdresseUtils";

interface AdresseInfoProps {
    adresse?: MottakerAdresseTo & DistribuerTilAdresse;
}

function renderDetailWhenExists(...values: string[]) {
    const valuesFiltered = values.filter((v) => v !== undefined);
    if (valuesFiltered.length > 0) {
        return <BodyShort size="medium">{valuesFiltered.join(" ")}</BodyShort>;
    }
}

export default function AdresseInfo({ adresse }: AdresseInfoProps) {
    return (
        <>
            {renderDetailWhenExists(adresse?.adresselinje1)}
            {renderDetailWhenExists(adresse?.adresselinje2)}
            {renderDetailWhenExists(adresse?.adresselinje3)}
            {renderDetailWhenExists(adresse?.postnummer, adresse?.poststed)}
            {renderDetailWhenExists(countryCodeToName(adresse?.landkode ?? adresse.land))}
        </>
    );
}
