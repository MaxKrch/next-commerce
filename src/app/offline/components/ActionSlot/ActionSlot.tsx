"use client";

import DefaultNetworkErrorActionSlot from "@components/NetworkError/slots/DefaultNetworkErrorActionSlot";

const ActionSlot: React.FC = () => {
    return(
        <DefaultNetworkErrorActionSlot action={() => window.location.reload()}/>
    );
};

export default ActionSlot;