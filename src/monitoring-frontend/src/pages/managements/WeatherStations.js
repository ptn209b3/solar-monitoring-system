import { withDeviceType } from "../../components";
import Entities from "./Entities";

export default withDeviceType(Entities, {
  value: "WeatherStation",
  label: "Weather Station",
});
