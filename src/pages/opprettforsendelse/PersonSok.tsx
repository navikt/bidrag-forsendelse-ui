import AvansertPersonSokButton from "@navikt/bidrag-ui-common/esm/react_components/person/AvansertPersonSokButton";
import { TextField } from "@navikt/ds-react";

interface IPersonSokProps {
    onChange: (ident: string) => void;
}
export default function PersonSok({ onChange }: IPersonSokProps) {
    function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        onChange(e.target.value);
    }
    return (
        <div className="pt-2 flex flex-row">
            <TextField size="small" label="Person -eller samhandler ident" onChange={onInputChange} />
            <AvansertPersonSokButton
                onResult={(data) => {
                    console.log("RES", data);
                    onChange(data.ident);
                }}
            />
        </div>
    );
}
