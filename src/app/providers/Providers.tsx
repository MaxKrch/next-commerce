import React, { PropsWithChildren, Suspense } from 'react';
import { RootStoreProvider } from './RootStoreContext';
import { QueryParamsStoreProvider } from './QueryParamsStoreProvider';
import Loader from '@components/Loader';
import clsx from 'clsx';
import style from '../app.module.scss';
import ModalsProvider from './ModalsProvider';
import ServiceWorkerProvider from './ServiceWorkerProvider';

const Providers: React.FC<PropsWithChildren> = ({children}) => {
    return(
        <Suspense fallback={
            <div className={clsx(style['loading'])}>
                <Loader className={clsx(style['loading__icon'])}/>
            </div>
        }>
            <ServiceWorkerProvider>
                <RootStoreProvider>
                    <QueryParamsStoreProvider>
                        <ModalsProvider>
                            {children}
                        </ModalsProvider>
                    </QueryParamsStoreProvider>
                </RootStoreProvider>
            </ServiceWorkerProvider>
        </Suspense>
    );
};

export default Providers;


  