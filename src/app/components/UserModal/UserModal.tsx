"use client"

import React from 'react';
import style from './UserModal.module.scss';
import { useRootStore } from '@providers/RootStoreContext';
import Portal from '@components/ModalPortal';
import { MODES } from '@constants/modal';

const UserModal: React.FC = () => {
    const { modalStore, userStore } = useRootStore();
console.log(userStore.isAuthorized, modalStore.isOpen, modalStore.mode)
    if(!userStore.isAuthorized || !modalStore.isOpen || modalStore.mode !== MODES.PROFILE) {
        return null;
    }

    return(
        <Portal>
            "i'm user"
        </Portal> 
    )
} 

export default UserModal;