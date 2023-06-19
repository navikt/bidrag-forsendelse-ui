import dokumentMock from "./dokumentMock";
import forsendelseMock from "./forsendelseMock";
import logMock from "./logMock";
import personMock from "./personMock";
import sakMock from "./sakMock";
import tokenMock from "./tokenMock";
export const handlers = [
    ...tokenMock(),
    ...logMock(),
    ...forsendelseMock(),
    ...personMock(),
    ...sakMock(),
    ...dokumentMock(),
];
// export const handlers = [...sakMock(), ...personMock()];
