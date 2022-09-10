import { withDeviceType } from "../../components";
import GenericDevice from "./GenericDevice";

export default withDeviceType(GenericDevice, {
  value: "Inverter",
  label: "Inverter",
});
