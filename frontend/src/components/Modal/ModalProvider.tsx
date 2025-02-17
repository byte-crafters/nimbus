'use client';
import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { DeleteModal } from '../DeleteModal/DeleteModal';
import { RenameModal } from '../RenameModal';
import { ShareModal } from '../ShareModal';
import { DeleteBinModal } from '../DeleteBinModal';
import { RestoreModal } from '../RestoreModal';

interface IProps {}

export const MODAL_TYPE = {
    RENAME: 'RENAME',
    DELETE: 'DELETE',
    SHARE: 'SHARE',
    DELETE_BIN: 'DELETE_BIN',
    RESTORE: 'RESTORE',
};

const MODALS = {
    [MODAL_TYPE.RENAME]: RenameModal,
    [MODAL_TYPE.DELETE]: DeleteModal,
    [MODAL_TYPE.SHARE]: ShareModal,
    [MODAL_TYPE.DELETE_BIN]: DeleteBinModal,
    [MODAL_TYPE.RESTORE]: RestoreModal,
};

type GlobalModalContext = {
    showModal: (modalType: string, modalProps?: any) => void;
    hideModal: () => void;
    store: any;
};

const initalState: GlobalModalContext = {
    showModal: () => {},
    hideModal: () => {},
    store: {},
};

const ModalContext = createContext(initalState);
export const useModalContext = () => useContext(ModalContext);

export const ModalProvider = ({ children }: PropsWithChildren<IProps>) => {
    const [store, setStore] = useState<any>({});
    const { modalType, modalProps } = store;

    const showModal = (modalType: string, modalProps: any = {}) => {
        setStore({
            ...store,
            modalType,
            modalProps,
        });
    };

    const hideModal = () => {
        setStore({
            ...store,
            modalType: null,
            modalProps: {},
        });
    };

    const Modal = () => {
        const ModalComponent = MODALS[modalType];
        if (!modalType || !ModalComponent) {
            return null;
        }

        return <ModalComponent {...modalProps} />;
    };

    return (
        <ModalContext.Provider value={{ store, showModal, hideModal }}>
            <Modal />
            {children}
        </ModalContext.Provider>
    );
};
