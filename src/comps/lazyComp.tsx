import React, { useEffect, useState, ComponentType } from "react";

export function LazyComp<T = {}>(
    props: {
        target: () => Promise<{ default: ComponentType<T> }>,
        targetProps?: T,
        onloading?: JSX.Element
    }): JSX.Element {
    let [Comp, setComp] = useState<ComponentType<T>>(null);

    useEffect(() => {
        (async () => {
            const comp = await props.target();
            if (comp.default != null) {
                setComp(comp.default);
            } else {
                throw new Error(" 'target' props of LazyComp must be default export ReactNode");
            }
        })
    }, []);

    return Comp ? <Comp {...props.targetProps} /> : props.onloading
}
