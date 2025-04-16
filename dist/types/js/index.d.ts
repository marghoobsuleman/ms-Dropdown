import "./lib/dd-webcomponent";
import MsDropdown from './lib/dd';
declare global {
    interface Window {
        MsDropdown: typeof MsDropdown;
    }
}
export default MsDropdown;
