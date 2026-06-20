"use client";

import { useEffect } from "react";
import { initFlowbite } from "flowbite";

export function FlowbiteInit() {
    useEffect(() => {
        initFlowbite();
    }, []);

    return null;
}