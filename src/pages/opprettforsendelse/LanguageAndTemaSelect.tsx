import LanguageSelect from "../../components/detaljer/LanguageSelect";
import TemaSelect from "../../components/detaljer/TemaSelect";

export default function LanguageAndTemaSelect() {
    return (
        <div className="flex flex-row gap-4 pb-4 pt-2">
            <LanguageSelect />
            <TemaSelect />
        </div>
    );
}
