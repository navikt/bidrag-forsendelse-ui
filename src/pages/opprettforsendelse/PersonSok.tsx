import AvansertPersonSokButton from "@navikt/bidrag-ui-common/esm/react_components/person/AvansertPersonSokButton";
import { Search } from "@navikt/ds-react";

interface IPersonSokProps {
    onChange: (ident: string) => void;
}
export default function PersonSok({ onChange }: IPersonSokProps) {
    function onInputChange(value: string) {
        onChange(value);
    }
    return (
        <div className="pt-2 flex flex-row gap-[5px]">
            <Search label="Person -eller samhandler ident" variant="simple" size="small" onChange={onInputChange} />
            <AvansertPersonSokButton
                onResult={(data) => {
                    console.log("RES", data);
                    onChange(data.ident);
                }}
            />
        </div>
    );
}
