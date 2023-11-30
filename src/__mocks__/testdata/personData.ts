import { PersonDto, PersonDtoKjonnEnum } from "../../api/BidragPersonApi";
import { TESTDATA_CASE_1 } from "./fellesdata";

export const personGjelder1: PersonDto = {
    ident: TESTDATA_CASE_1.BP,
    navn: "Lørdag, Treig",
    fornavn: "Treig",
    etternavn: "Lørdag",
    kjønn: PersonDtoKjonnEnum.KVINNE,
    foedselsdato: "1992-07-15",
    kortnavn: "Treig Lørdag",
    visningsnavn: "Treig Lørdag",
};

export const personGjelder2: PersonDto = {
    ident: TESTDATA_CASE_1.BM,
    navn: "Bokstav, Urimelig",
    fornavn: "Urimelig",
    etternavn: "Bokstav",
    kjønn: PersonDtoKjonnEnum.MANN,
    foedselsdato: "1977-04-14",
    kortnavn: "Urimelig Bokstav",
    visningsnavn: "Urimelig Bokstav",
};

export const personGjelder3: PersonDto = {
    ident: TESTDATA_CASE_1.BA2,
    navn: "Kaie, Kontrollert Utnyttende",
    fornavn: "Kontrollert",
    mellomnavn: "Utnyttende",
    etternavn: "Kaie",
    kjønn: PersonDtoKjonnEnum.KVINNE,
    foedselsdato: "2017-02-25",
    kortnavn: "Kontrollert Kaie",
    visningsnavn: "Kontrollert Kaie",
};

export const personGjelder4: PersonDto = {
    ident: TESTDATA_CASE_1.BA1,
    navn: "Opportunist, Riktig",
    fornavn: "Riktig",
    etternavn: "Opportunist",
    kjønn: PersonDtoKjonnEnum.KVINNE,
    foedselsdato: "1984-08-21",
    kortnavn: "Riktig Opportunist",
    visningsnavn: "Riktig Opportunist",
};
export const personMap: Map<string, Partial<PersonDto>> = new Map([
    [personGjelder1.ident, personGjelder1],
    [personGjelder2.ident, personGjelder2],
    [personGjelder3.ident, personGjelder3],
    [personGjelder4.ident, personGjelder4],
]);
