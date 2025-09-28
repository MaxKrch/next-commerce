import React, { PropsWithChildren, Suspense } from 'react';
import { RootStoreProvider } from './RootStoreContext';
import { QueryParamsStoreProvider } from './QueryParamsStoreProvider';
import Loader from '@components/Loader';
import clsx from 'clsx';
import style from '../app.module.scss';

const Provoders: React.FC<PropsWithChildren> = ({children}) => {
    return(
        <Suspense fallback={
            <div className={clsx(style['loading'])}>
                <Loader className={clsx(style['loading__icon'])}/>
            </div>
        }>
            <RootStoreProvider>
                <QueryParamsStoreProvider>
                    {children}
                </QueryParamsStoreProvider>
            </RootStoreProvider>
        </Suspense>
    )
}

export default Provoders;


  