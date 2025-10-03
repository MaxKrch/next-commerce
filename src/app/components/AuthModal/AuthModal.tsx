"use client"

import React, {  useCallback, useState } from 'react';
import style from './AuthModal.module.scss';
import { useRootStore } from '@providers/RootStoreContext';
import { observer } from 'mobx-react-lite';
import { MODES } from '@constants/modal';
import ModalPortal from '@components/ModalPortal';
import clsx from 'clsx';
import AuthHeader  from './components/AuthHeader/AuthHeader';
import AuthForm from './components/AuthForm/AuthForm';
import { AUTH_MODES, AuthModes } from './constants';
import { Schema } from './AuthModal.schema';
import { META_STATUS } from '@constants/meta-status';

const AuthModal: React.FC = () => {
    const { modalStore, userStore } = useRootStore();
    const [authMode, setAuthMode] = useState<AuthModes>(AUTH_MODES.LOGIN);
 
    const handleSubmit = useCallback(async (data: Schema) => {
        let success: boolean;

        if(authMode === AUTH_MODES.REGISTER) {
            if(!data.email) {
                return;
            }

            const result = await userStore.register({
                username: data.login,
                password: data.password,
                email: data.email
                
            }, data.saveMe);
            success = result.success;

        } else {
            const result = await userStore.login({
                identifier: data.login,
                password: data.password,
            }, data.saveMe);
            success = result.success
        }

        if(success) {
            modalStore.close();
        }
    }, [userStore, modalStore, authMode])

    const shouldShow = modalStore.isOpen 
        && modalStore.mode === MODES.AUTH 
        && !userStore.isAuthorized 

    if(!shouldShow) {
        return null;
    }

    return(
        <ModalPortal>
            <div className={clsx(style['auth'])}>
                <AuthHeader mode={authMode} onChange={setAuthMode}/>
                <AuthForm 
                    mode={authMode}
                    onSubmit={handleSubmit} 
                    needReset={!modalStore.isOpen} 
                    error={userStore.error} 
                    loading={userStore.status === META_STATUS.PENDING}
                />
            </div>
        </ModalPortal>
    )
}

export default observer(AuthModal);