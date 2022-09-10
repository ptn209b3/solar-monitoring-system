import { withDeviceType } from "../../components";
import GenericDevice from "./GenericDevice";

export default withDeviceType(GenericDevice, {
  value: "Device",
  label: "Device",
});
