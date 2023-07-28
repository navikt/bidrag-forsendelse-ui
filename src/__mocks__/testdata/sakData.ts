import { BidragSakDto } from "../../api/BidragSakApi";
import { PERSON_FNR_2, TESTDATA_CASE_1 } from "./fellesdata";
import { PERSON_FNR_1 } from "./fellesdata";

export const sakData1: BidragSakDto = {
    eierfogd: "4806",
    saksnummer: "2300062",
    saksstatus: "SO",
    kategori: "Nasjonal",
    erParagraf19: false,
    begrensetTilgang: false,
    roller: [
        {
            fodselsnummer: TESTDATA_CASE_1.BM,
            type: "BM",
            objektnummer: "02",
            reellMottager: null,
            mottagerErVerge: false,
            samhandlerIdent: null,
            foedselsnummer: TESTDATA_CASE_1.BM,
            rolleType: "BM",
        },
        {
            fodselsnummer: TESTDATA_CASE_1.BP,
            type: "BP",
            objektnummer: "01",
            reellMottager: null,
            mottagerErVerge: false,
            samhandlerIdent: null,
            foedselsnummer: TESTDATA_CASE_1.BP,
            rolleType: "BP",
        },
        {
            fodselsnummer: TESTDATA_CASE_1.BA1,
            type: "BA",
            objektnummer: "04",
            reellMottager: null,
            mottagerErVerge: false,
            samhandlerIdent: null,
            rolleType: "BA",
        },
        {
            fodselsnummer: TESTDATA_CASE_1.BA2,
            type: "BA",
            objektnummer: "03",
            reellMottager: null,
            mottagerErVerge: false,
            samhandlerIdent: null,
            rolleType: "BA",
        },
    ],
};
export const sakMap: Map<string, Partial<BidragSakDto>> = new Map([[sakData1.saksnummer, sakData1]]);

const sakerBM = [
    {
        eierfogd: "4806",
        saksnummer: "2300105",
        saksstatus: "NY",
        kategori: "N",
        roller: [
            {
                fodselsnummer: PERSON_FNR_2,
                rolleType: "BA",
            },
            {
                fodselsnummer: TESTDATA_CASE_1.BM,
                rolleType: "BP",
            },
            {
                fodselsnummer: TESTDATA_CASE_1.BP,
                rolleType: "BM",
            },
        ],
    },
    {
        eierfogd: "4865",
        saksnummer: "2300113",
        saksstatus: "SO",
        roller: [
            {
                fodselsnummer: PERSON_FNR_1,
                rolleType: "BA",
            },
            {
                fodselsnummer: PERSON_FNR_2,
                rolleType: "BA",
            },
            {
                fodselsnummer: TESTDATA_CASE_1.BM,
                rolleType: "BP",
            },
            {
                fodselsnummer: TESTDATA_CASE_1.BP,
                rolleType: "BM",
            },
            {
                fodselsnummer: TESTDATA_CASE_1.BA2,
                rolleType: "BA",
            },
        ],
    },
    {
        eierfogd: "4806",
        saksnummer: "2300001",
        saksstatus: "NY",
        kategori: "U",
        erParagraf19: false,
        begrensetTilgang: false,
        roller: [
            {
                fodselsnummer: PERSON_FNR_2,
                rolleType: "BA",
            },
            {
                fodselsnummer: TESTDATA_CASE_1.BM,
                rolleType: "BM",
            },
            {
                fodselsnummer: TESTDATA_CASE_1.BP,
                rolleType: "BP",
            },
        ],
    },
    {
        eierfogd: "4806",
        saksnummer: "2300062",
        saksstatus: "SO",
        kategori: "N",
        erParagraf19: false,
        begrensetTilgang: false,
        roller: [
            {
                fodselsnummer: TESTDATA_CASE_1.BM,
                rolleType: "BM",
            },
            {
                fodselsnummer: TESTDATA_CASE_1.BP,
                rolleType: "BP",
            },
            {
                fodselsnummer: TESTDATA_CASE_1.BA1,
                rolleType: "BA",
            },
            {
                fodselsnummer: TESTDATA_CASE_1.BA2,
                rolleType: "BA",
            },
        ],
    },
];

const sakerBP = [
    {
        eierfogd: "4806",
        saksnummer: "2300001",
        saksstatus: "NY",
        kategori: "Utland",
        erParagraf19: false,
        begrensetTilgang: false,
        roller: [
            {
                fodselsnummer: PERSON_FNR_2,
                rolleType: "BA",
            },
            {
                fodselsnummer: TESTDATA_CASE_1.BM,
                rolleType: "BM",
            },
            {
                fodselsnummer: TESTDATA_CASE_1.BP,
                rolleType: "BP",
            },
        ],
    },
    {
        eierfogd: "4806",
        saksnummer: "2300062",
        saksstatus: "SO",
        kategori: "N",
        erParagraf19: false,
        begrensetTilgang: false,
        roller: [
            {
                fodselsnummer: TESTDATA_CASE_1.BM,
                rolleType: "BM",
            },
            {
                fodselsnummer: TESTDATA_CASE_1.BP,
                rolleType: "BP",
            },
            {
                fodselsnummer: TESTDATA_CASE_1.BA1,
                rolleType: "BA",
            },
            {
                fodselsnummer: TESTDATA_CASE_1.BA2,
                rolleType: "BA",
            },
        ],
    },
    {
        eierfogd: "4806",
        saksnummer: "2300105",
        saksstatus: "NY",
        kategori: "N",
        erParagraf19: false,
        begrensetTilgang: false,
        roller: [
            {
                fodselsnummer: PERSON_FNR_2,
                rolleType: "BA",
            },
            {
                fodselsnummer: TESTDATA_CASE_1.BM,
                rolleType: "BP",
            },
            {
                fodselsnummer: TESTDATA_CASE_1.BP,
                rolleType: "BM",
            },
        ],
    },
    {
        eierfogd: "4865",
        saksnummer: "2300113",
        saksstatus: "SO",
        kategori: "U",
        erParagraf19: false,
        begrensetTilgang: false,
        roller: [
            {
                fodselsnummer: PERSON_FNR_1,
                rolleType: "BA",
            },
            {
                fodselsnummer: PERSON_FNR_2,
                rolleType: "BA",
            },
            {
                fodselsnummer: TESTDATA_CASE_1.BM,
                rolleType: "BP",
            },
            {
                fodselsnummer: TESTDATA_CASE_1.BP,
                rolleType: "BM",
            },
            {
                fodselsnummer: TESTDATA_CASE_1.BA2,
                rolleType: "BA",
            },
        ],
    },
];

// @ts-ignore
export const sakerPersonMap: Map<string, Partial<BidragSakDto>[]> = new Map([
    [TESTDATA_CASE_1.BM, sakerBM],
    [TESTDATA_CASE_1.BP, sakerBP],
]);
