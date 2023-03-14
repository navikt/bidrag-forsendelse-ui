import { Edit } from "@navikt/ds-icons";
import { Heading } from "@navikt/ds-react";
import { Loader } from "@navikt/ds-react";
import { Button } from "@navikt/ds-react";
import React from "react";
import { useState } from "react";

import { DistribuerTilAdresse } from "../../../api/BidragDokumentApi";
import AdresseInfo from "../../../components/AdresseInfo";
import Mottaker from "../components/Mottaker";
import EditAddress from "./EditAddress";

interface BestillDistribusjonContentProps {
    editable?: boolean;
    adresse: DistribuerTilAdresse;
    onEditModeChanged?: (inEditMode: boolean) => void;
    onAdresseChanged: (adresse: DistribuerTilAdresse) => void;
}
export default function BestillDistribusjonInfo({
    editable = true,
    adresse,
    onAdresseChanged,
    onEditModeChanged,
}: BestillDistribusjonContentProps) {
    const [adressEditable, setAdressEditable] = useState<boolean>(false);

    function changeAdressEditable(value: boolean) {
        onEditModeChanged(value);
        setAdressEditable(value);
    }
    return (
        <div className={"pr-5 pl-5 pt-8 pb-8"}>
            <Mottaker />
            <div>
                <Heading size={"small"} className={"pb-1"}>
                    {adressEditable ? "Endre adresse" : "Adresse"}
                </Heading>
                <div className={"flex w-full"}>
                    {adressEditable ? (
                        <React.Suspense fallback={<Loader variant="neutral" size="small" fr="true" />}>
                            <EditAddress
                                address={adresse}
                                onSubmit={(adresse) => {
                                    onAdresseChanged(adresse);
                                    changeAdressEditable(false);
                                }}
                                onCancel={() => changeAdressEditable(false)}
                            />
                        </React.Suspense>
                    ) : (
                        <div className="pt-2">
                            <AdresseInfo adresse={adresse} />
                        </div>
                    )}
                    <div className={"pl-1"}>
                        {!adressEditable && editable && (
                            <Button
                                id={"endre_adresse_knapp"}
                                variant="tertiary"
                                size="small"
                                onClick={() => changeAdressEditable(true)}
                                icon={<Edit fr="true" />}
                            >
                                {!adresse ? "Legg til" : "Endre"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
