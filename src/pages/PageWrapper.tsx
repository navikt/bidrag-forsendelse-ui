import "../index.css";

import { MDXProvider } from "@mdx-js/react";
import { BodyShort, Heading } from "@navikt/ds-react";
import * as dayjs from "dayjs";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import React, { PropsWithChildren } from "react";
import { QueryClientProvider } from "react-query";
import { QueryClient } from "react-query";

import { initMock } from "../__mocks__/msw";
import DokumentStatusTag from "../components/dokument/DokumentStatusTag";
const mdxComponents = { Heading, DokumentStatusTag, BodyShort };

dayjs.extend(customParseFormat);
initMock();
const initReactQuery = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                suspense: true,
                staleTime: Infinity,
                retry: 3,
                retryDelay: 3000,
            },
        },
    });

export const queryClient = initReactQuery();
interface PageWrapperProps {
    name: string;
}
export default function PageWrapper({ children, name }: PropsWithChildren<PageWrapperProps>) {
    return (
        <MDXProvider components={mdxComponents}>
            <QueryClientProvider client={queryClient}>
                <div id={name} className={"w-full"}>
                    {children}
                </div>
            </QueryClientProvider>
        </MDXProvider>
    );
}
