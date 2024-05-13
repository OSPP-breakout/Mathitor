import { API } from "../../file_management_backend/file_management_preload";

declare global {
    interface Window {electronAPI: typeof API}
}

window.electronAPI.setTitle()

