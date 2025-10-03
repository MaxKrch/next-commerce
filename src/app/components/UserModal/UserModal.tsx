"use client"

import React, { useCallback, useState } from 'react';
import style from './UserModal.module.scss';
import { useRootStore } from '@providers/RootStoreContext';
import ModalPortal from '@components/ModalPortal';
import { MODES } from '@constants/modal';
import { observer } from 'mobx-react-lite';
import Button from '@components/Button';
import clsx from 'clsx';
import Text from '@components/Text';
import Image from 'next/image';
import { META_STATUS } from '@constants/meta-status';
import Loader from '@components/Loader';

const UserModal: React.FC = () => {
    const { modalStore, userStore } = useRootStore();
    const [error, setError] = useState<string | null>(null)

    const handleLogout = useCallback(() => {
        setError(null)
        const result = userStore.logout();
        
        if(!result.success) {
            setError('Что-то пошло не так...');
            return;
        }
        
        modalStore.close()
    }, [])

    const shouldShow = modalStore.isOpen 
        && modalStore.mode === MODES.PROFILE 
        && userStore.isAuthorized 
   
    if(!shouldShow) {
        return null;
    }

    return(
        <ModalPortal>
            <div className={clsx(style['user-modal'])}>
                <div className={clsx(style['user-modal__image-wrapper'])}>
                    <Image 
                        className={clsx(style['user-modal__image'])}
                        src="/avatar.png"
                        alt="Default avatar"
                        fill
                        priority
                        sizes='300px'
                    />
                </div>
                <div className={clsx(style['user-modal__info'])}>
                    <div className={clsx(style['user-modal__section'])}>
                        <Text className={clsx(style['user-modal__section-title'])} weight='bold'>
                            Ник: 
                        </Text>
                        <Text className={clsx(style['user-modal__section-value'])}>
                            {userStore.user?.username}
                        </Text>
                    </div>
                    <div className={clsx(style['user-modal__section'])}>
                        <Text className={clsx(style['user-modal__section-title'])} weight='bold'>
                            Email: 
                        </Text>
                        <Text className={clsx(style['user-modal__section-value'])}>
                            {userStore.user?.email}
                        </Text>
                    </div>    
                    <div className={clsx(style['user-modal__section'])}>
                        <Text className={clsx(style['user-modal__section-title'])} weight='bold'>
                            Регистрация: 
                        </Text>
                        <Text className={clsx(style['user-modal__section-value'])}>
                            {"25 марта 2025"}
                        </Text>  
                    </div>
                </div>
                <div className={clsx(style['user-modal__error'])}>
                    {error && <span>Что-то пошло не так...</span>}
                </div>                
                <div className={clsx(style['user-modal__action'])}>
                    <Button onClick={handleLogout} loading={userStore.status === META_STATUS.PENDING} className={clsx(style['user-modal__button'])}>
                        {userStore.status === META_STATUS.PENDING && 
                            <Loader size='s' className={clsx(style['user-modal__action-icon'])}/>
                        }
                        Выйти
                    </Button>            
                </div>
    
            </div>
        </ModalPortal> 
    )
} 

export default observer(UserModal)


















































;