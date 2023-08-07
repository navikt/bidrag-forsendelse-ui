import "../index.css";

import { MDXProvider } from "@mdx-js/react";
import { ArrowRightIcon } from "@navikt/aksel-icons";
import { BodyShort, Heading, Loader } from "@navikt/ds-react";
import * as dayjs from "dayjs";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import React, { PropsWithChildren } from "react";
import { QueryClientProvider } from "react-query";
import { QueryClient } from "react-query";

import { initMock } from "../__mocks__/msw";
import DokumentLinkedTag from "../components/dokument/DokumentLinkedTag";
import DokumentStatusTag from "../components/dokument/DokumentStatusTag";
import ErrorProvider from "../context/ErrorProvider";
const mdxComponents = { Heading, DokumentStatusTag, BodyShort, ArrowRightIcon, DokumentLinkedTag };

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
            mutations: {
                onError: (err, variables, context) => console.log("err", err, variables, context),
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
            <ErrorProvider>
                <QueryClientProvider client={queryClient}>
                    <React.Suspense fallback={<Loader size={"3xlarge"} title={"Laster..."} />}>
                        <div id={name} className={"w-full"}>
                            {children}
                        </div>
                    </React.Suspense>
                </QueryClientProvider>
            </ErrorProvider>
        </MDXProvider>
    );
}
