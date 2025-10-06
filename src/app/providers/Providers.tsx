import React, { PropsWithChildren } from 'react';
import { RootStoreProvider } from './RootStoreContext';
import { QueryParamsStoreProvider } from './QueryParamsStoreProvider';

import ModalsProvider from './ModalsProvider';
import ServiceWorkerProvider from './ServiceWorkerProvider';

const Providers: React.FC<PropsWithChildren> = ({children}) => {
    return(
        <>
            <ServiceWorkerProvider />
            <RootStoreProvider>
                <QueryParamsStoreProvider>
                    <ModalsProvider>
                        {children}
                    </ModalsProvider>
                </QueryParamsStoreProvider>
            </RootStoreProvider>
        </>
    );
};

export default Providers;


  