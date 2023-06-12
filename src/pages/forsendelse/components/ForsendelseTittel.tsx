import { PencilIcon } from "@navikt/aksel-icons";
import { Button, Heading, TextField } from "@navikt/ds-react";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";

import { BIDRAG_FORSENDELSE_API } from "../../../api/api";
import { OppdaterForsendelseResponse } from "../../../api/BidragForsendelseApi";
import { useForsendelseApi, UseForsendelseApiKeys } from "../../../hooks/useForsendelseApi";
export default function ForsendelseTittel() {
    const forsendelse = useForsendelseApi().hentForsendelse();
    const [editMode, setEditMode] = useState(false);
    const [forsendelseTittel, setForsendelseTittel] = useState(forsendelse.tittel);

    useEffect(() => {
        setForsendelseTittel(forsendelse.tittel);
    }, [forsendelse.tittel]);

    const enableEditMode = () => setEditMode(true);
    const disableEditMode = () => setEditMode(false);
    const onSubmit = (updatedTitle: string) => {
        console.log(updatedTitle);
        setForsendelseTittel(updatedTitle);
        disableEditMode();
    };
    if (editMode) {
        return <EditForsendelseTitle onSubmit={onSubmit} onCancel={disableEditMode} defaultValue={forsendelseTittel} />;
    }
    return (
        <Heading spacing size={"large"} className={"w-max flex flex-row"}>
            {forsendelseTittel}{" "}
            <Button size="medium" variant="tertiary-neutral" icon={<PencilIcon />} onClick={enableEditMode} />
        </Heading>
    );
}

interface EditForsendelseTitleProps {
    onSubmit: (updatedTitle: string) => void;
    onCancel: () => void;
    defaultValue: string;
}
function EditForsendelseTitle({ onCancel, onSubmit, defaultValue }: EditForsendelseTitleProps) {
    const forsendelse = useForsendelseApi().hentForsendelse();
    const [updatedTitle, setUpdatedTitle] = useState<string>();
    const queryClient = useQueryClient();
    const isCanceled = useRef(false);
    const updateTitleMutation = useMutation<OppdaterForsendelseResponse, null, { title: string }>({
        mutationFn: ({ title }) =>
            BIDRAG_FORSENDELSE_API.api
                .oppdaterForsendelse(forsendelse.forsendelseId, {
                    tittel: title,
                    dokumenter: [],
                })
                .then((res) => res.data),
        onSuccess: (data) => onSubmit(data.tittel ?? defaultValue),
    });

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setUpdatedTitle(value);
    }
    async function _onSubmit() {
        console.log("SUBMIT");
        if (isCanceled.current) return;
        if (updatedTitle) {
            await updateTitleMutation.mutate({ title: updatedTitle });
            queryClient.refetchQueries(UseForsendelseApiKeys.hentForsendelse());
        } else {
            onSubmit(defaultValue);
        }
    }
    return (
        <TextField
            onBlur={_onSubmit}
            onKeyDown={(e) => {
                if (e.key.toLowerCase() == "enter") _onSubmit();
                if (e.key.toLowerCase() == "escape") onCancel();
            }}
            autoFocus
            defaultValue={defaultValue}
            name="tittel"
            label="Tittel"
            onChange={onChange}
            error={updateTitleMutation.isError ? "Kunne ikke lagre endringer" : undefined}
            hideLabel
            className="w-2/3"
        />
    );
}
