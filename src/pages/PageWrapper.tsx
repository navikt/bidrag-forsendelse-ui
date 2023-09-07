import "../index.css";

import { MDXProvider, useMDXComponents } from "@mdx-js/react";
import { ArrowRightIcon } from "@navikt/aksel-icons";
import { BodyLong, BodyShort, Heading, Label, Loader } from "@navikt/ds-react";
import { useThemedStylesWithMdx } from "@theme-ui/mdx";
import * as dayjs from "dayjs";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import React, { PropsWithChildren } from "react";
import { QueryClientProvider } from "react-query";
import { QueryClient } from "react-query";
import { Theme, ThemeUIProvider } from "theme-ui";

import { initMock } from "../__mocks__/msw";
import DokumentLinkedTag from "../components/dokument/DokumentLinkedTag";
import DokumentStatusTag from "../components/dokument/DokumentStatusTag";
import ErrorProvider from "../context/ErrorProvider";
const mdxComponents = { Heading, DokumentStatusTag, BodyShort, ArrowRightIcon, DokumentLinkedTag, BodyLong, Label };

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
const theme: Theme = {
    config: {
        useRootStyles: false,
    },
    fonts: {
        body: 'var(--a-font-family,"Source Sans Pro",Arial,sans-serif)',
    },
    fontWeights: {
        body: "var(--a-font-weight-regular)",
    },
    lineHeights: {
        body: "var(--a-font-line-height-medium)",
    },
    styles: {
        root: {
            fontFamily: 'var(--a-font-family,"Source Sans Pro",Arial,sans-serif)',
            lineHeight: "var(--a-font-line-height-medium)",
            fontWeight: "var(--a-font-weight-regular)",
            fontSize: "var(--a-font-size-large)",
        },
        p: {
            maxWidth: "65rem",
        },
        h1: {
            fontSize: "var(--a-font-size-heading-xlarge)",
        },
        h2: {
            fontSize: "var(--a-font-size-heading-large)",
            marginTop: 0
        },
        h3: {
            fontSize: "var(--a-font-size-heading-medium)",
        },
        h4: {
            fontSize: "var(--a-font-size-heading-small)",
        },
        h5: {
            fontSize: "var(--a-font-size-heading-xsmall)",
        },
    },
};

export default function PageWrapper({ children, name }: PropsWithChildren<PageWrapperProps>) {
    const componentsWithStyles = useThemedStylesWithMdx(useMDXComponents());
    return (
        <ThemeUIProvider theme={theme}>
            <MDXProvider components={{ ...mdxComponents, ...componentsWithStyles }}>
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
        </ThemeUIProvider>
    );
}
