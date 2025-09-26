import React, { PropsWithChildren } from 'react';
import { RootStoreProvider } from './RootStoreContext';
import { QueryParamsStoreProvider } from './QueryParamsStoreProvider';

const Provoders: React.FC<PropsWithChildren> = ({children}) => {
    return(
        <RootStoreProvider>
            <QueryParamsStoreProvider>
                {children}
            </QueryParamsStoreProvider>
        </RootStoreProvider>
    )
}

export default Provoders;