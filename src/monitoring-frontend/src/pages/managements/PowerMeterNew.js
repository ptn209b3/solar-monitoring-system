import { withDeviceType } from "../../components";
import GenericDeviceNew from "./GenericDeviceNew";

export default withDeviceType(GenericDeviceNew, {
  value: "PowerMeter",
  label: "Power Meter",
});
