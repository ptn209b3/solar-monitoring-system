import { withDeviceType } from "../../components";
import GenericDeviceNew from "./GenericDeviceNew";

export default withDeviceType(GenericDeviceNew, {
  value: "WeatherStation",
  label: "Weather Station",
});
