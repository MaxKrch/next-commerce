"use client";

import useServiceWorker from "@hooks/useServiceWorker";
import { PropsWithChildren } from "react";

const ServiceWorkerProvider: React.FC<PropsWithChildren> = ({ children }) => {
    useServiceWorker();

    return children;
};

export default ServiceWorkerProvider;