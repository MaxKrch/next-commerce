import DefaultNetworkErrorContentSlot from "@components/NetworkError/slots/DefaultNetworkErrorContentSlot";
import style from './page.module.scss';
import clsx from "clsx";
import ActionSlot from "./components/ActionSlot";

export default function OfflinePage () {
    return(
        <div className={clsx(style['offline'])}>
            <div className={clsx(style['offline__content-slot'])}>
                <DefaultNetworkErrorContentSlot />
            </div>
            <div className={clsx(style['offline__action-slot'])}>
                <ActionSlot />
            </div>
        </div>
    );
}