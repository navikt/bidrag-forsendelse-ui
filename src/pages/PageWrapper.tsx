import "../index.css";

import * as dayjs from "dayjs";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import React, { PropsWithChildren } from "react";
import { QueryClientProvider } from "react-query";
import { QueryClient } from "react-query";

import { initMock } from "../__mocks__/msw";
dayjs.extend(customParseFormat);
initMock();
const initReactQuery = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                suspense: true,
                staleTime: Infinity,
                retry: true,
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
        <QueryClientProvider client={queryClient}>
            <div id={name} className={"w-full"}>
                {children}
            </div>
        </QueryClientProvider>
    );
}
