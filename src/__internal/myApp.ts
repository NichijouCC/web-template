import { internal_init } from "./appInit";

export class MyApp {
    static start = (init?: () => void) => {
        internal_init();
        if (init) init();
    }
}
