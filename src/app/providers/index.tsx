import { RootStoreProvider } from './root-store-context';
import { QueryParamsStoreProvider } from './query-params-store-provider';
import React, { PropsWithChildren } from 'react';

const Provider: React.FC<PropsWithChildren> = ({children}) => {
    return(
        <RootStoreProvider>
            <QueryParamsStoreProvider>
                {children}
            </QueryParamsStoreProvider>
        </RootStoreProvider>
    )
}

export default Provider;