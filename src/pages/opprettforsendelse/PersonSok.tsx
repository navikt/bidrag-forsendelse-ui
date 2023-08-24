import "./PersonSok.css";

import { PersonSokButton } from "@navikt/bidrag-ui-common";
import { Search } from "@navikt/ds-react";
interface IPersonSokProps {
    onChange: (ident: string) => void;
    defaultValue?: string;
}
export default function PersonSok({ onChange, defaultValue }: IPersonSokProps) {
    function onInputChange(value: string) {
        onChange(value?.trim());
    }
    return (
        <div className="pt-2 flex flex-row gap-[5px] personsok">
            <Search
                label="Person -eller samhandler ident"
                variant="simple"
                size="small"
                hideLabel={false}
                onChange={onInputChange}
                value={defaultValue}
            />
            <PersonSokButton
                onResult={(data) => {
                    onChange(data.ident);
                }}
            />
        </div>
    );
}
