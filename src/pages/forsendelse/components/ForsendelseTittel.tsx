import { PencilIcon } from "@navikt/aksel-icons";
import { XMarkIcon } from "@navikt/aksel-icons";
import { CloudUpIcon } from "@navikt/aksel-icons";
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
    return (
        <div>
            <div className={"w-max flex flex-row gap-[5px]"}>
                <Heading spacing size={"large"}>
                    {forsendelseTittel}{" "}
                </Heading>
                {!editMode && (
                    <Button
                        className="w-max h-max mt-1"
                        size="small"
                        variant="tertiary"
                        icon={<PencilIcon />}
                        onClick={enableEditMode}
                    >
                        Endre tittel
                    </Button>
                )}
            </div>
            {editMode && (
                <EditForsendelseTitle onSubmit={onSubmit} onCancel={disableEditMode} defaultValue={forsendelseTittel} />
            )}
        </div>
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
        <div className="flex flex-row gap-[5px] mb-4">
            <TextField
                onKeyDown={(e) => {
                    if (e.key.toLowerCase() == "enter") _onSubmit();
                    if (e.key.toLowerCase() == "escape") onCancel();
                }}
                autoFocus
                disabled={updateTitleMutation.isLoading}
                defaultValue={defaultValue}
                name="tittel"
                size="small"
                label="Navn på forsendelsen"
                onChange={onChange}
                error={updateTitleMutation.isError ? "Kunne ikke lagre endringer" : undefined}
                className="w-2/3"
            />
            <div className="self-end">
                <Button
                    loading={updateTitleMutation.isLoading}
                    size="small"
                    variant="tertiary"
                    icon={<CloudUpIcon />}
                    onClick={_onSubmit}
                >
                    Lagre
                </Button>
                <Button
                    disabled={updateTitleMutation.isLoading}
                    size="small"
                    variant="tertiary"
                    icon={<XMarkIcon />}
                    onClick={onCancel}
                >
                    Avbryt
                </Button>
            </div>
        </div>
    );
}
