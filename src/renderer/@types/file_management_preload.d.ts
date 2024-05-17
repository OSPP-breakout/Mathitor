import { API } from "../../fileManagementBackend/fileManagementPreload";

declare global {
    interface Window {electronAPI: typeof API}
}

window.electronAPI.setTitle()

