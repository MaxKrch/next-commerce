import NetworkError from "@components/NetworkError";
import DefaultNetworkErrorActionSlot from "@components/NetworkError/slots/DefaultNetworkErrorActionSlot";
import DefaultNetworkErrorContentSlot from "@components/NetworkError/slots/DefaultNetworkErrorContentSlot";
import style from './page.module.scss';
import clsx from "clsx";

export default function OfflinePage () {
    return(
        <div className={clsx(style['offline'])}>
            <NetworkError 
                ContentSlot={DefaultNetworkErrorContentSlot}
                ActionSlot={() => <DefaultNetworkErrorActionSlot action={() => window.location.reload()} />}
            />
        </div>
    );
}