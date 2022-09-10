import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toolbar, Stack } from "@mui/material";

import Loading from "./Loading";

const Sites = lazy(() => import("../pages/managements/Sites"));
const SiteNew = lazy(() => import("../pages/managements/SiteNew"));
const Site = lazy(() => import("../pages/managements/Site"));

const Gateways = lazy(() => import("../pages/managements/Gateways"));
const GatewayNew = lazy(() => import("../pages/managements/GatewayNew"));
const Gateway = lazy(() => import("../pages/managements/Gateway"));
const GatewayProvision = lazy(() =>
  import("../pages/managements/GatewayProvision")
);

const Devices = lazy(() => import("../pages/managements/Devices"));
const Device = lazy(() => import("../pages/managements/Device"));
const DeviceSettings = lazy(() =>
  import("../pages/managements/DeviceSettings")
);

const DeviceModels = lazy(() => import("../pages/managements/DeviceModels"));
const DeviceModel = lazy(() => import("../pages/managements/DeviceModel"));
const DeviceModelNew = lazy(() =>
  import("../pages/managements/DeviceModelNew")
);

const Inverters = lazy(() => import("../pages/managements/Inverters"));
const Inverter = lazy(() => import("../pages/managements/Inverter"));
const InverterNew = lazy(() => import("../pages/managements/InverterNew"));

const PowerMeters = lazy(() => import("../pages/managements/PowerMeters"));
const PowerMeterNew = lazy(() => import("../pages/managements/PowerMeterNew"));
const PowerMeter = lazy(() => import("../pages/managements/PowerMeter"));

const WeatherStations = lazy(() =>
  import("../pages/managements/WeatherStations")
);
const WeatherStation = lazy(() =>
  import("../pages/managements/WeatherStation")
);
const WeatherStationNew = lazy(() =>
  import("../pages/managements/WeatherStationNew")
);

const Users = lazy(() => import("../pages/managements/Users"));
const UserNew = lazy(() => import("../pages/managements/UserNew"));
const User = lazy(() => import("../pages/managements/User"));

const NotFoundPage = lazy(() => import("../pages/NotFound"));
const Test = lazy(() => import("../pages/Test"));
const HomePage = lazy(() => import("../pages/Home"));

// **** central-monitor ****
const Fleetview = lazy(() => import("../pages/central-monitor/Fleetview"));
const SiteList = lazy(() => import("../pages/central-monitor/SiteList"));
// ********************

// **** site-monitor ****
const ViewSites = lazy(() => import("../pages/site-monitor/ViewSites"));
const ViewSite = lazy(() => import("../pages/site-monitor/ViewSite"));
// ********************

const SiteReport = lazy(() => import("../pages/reports/SiteReport"));
const DeviceReport = lazy(() => import("../pages/reports/DeviceReport"));

const drawerWidth = 240;

function Main() {
  return (
    <Stack
      component="main"
      flex={1}
      overflow="auto"
      width={{ lg: `calc(100% - ${drawerWidth}px)` }}
    >
      <Toolbar />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<HomePage />} />

          <Route path="managements">
            <Route index element={<Navigate to="sites" />} />
            <Route path="sites">
              <Route index element={<Sites />} />
              <Route path="new" element={<SiteNew />} />
              <Route path=":siteId">
                <Route index element={<Site />} />
                <Route path="gateways">
                  <Route index element={<Gateways />} />
                  <Route path="new" element={<GatewayNew />} />
                  <Route path=":gatewayId">
                    <Route index element={<Gateway />} />
                    <Route path="provision" element={<GatewayProvision />} />

                    <Route path="Device">
                      <Route index element={<Devices />} />

                      <Route path=":deviceId">
                        <Route index element={<Device />} />
                        <Route path="settings" element={<DeviceSettings />} />
                      </Route>
                    </Route>

                    <Route path="DeviceModel">
                      <Route index element={<DeviceModels />} />
                      <Route path=":deviceModelId" element={<DeviceModel />} />
                      <Route path="new" element={<DeviceModelNew />} />
                    </Route>

                    <Route path="Inverter">
                      <Route index element={<Inverters />} />
                      <Route path="new" element={<InverterNew />} />
                      <Route path=":inverterId">
                        <Route index element={<Inverter />} />
                        <Route path="settings" element={<DeviceSettings />} />
                      </Route>
                    </Route>

                    <Route path="PowerMeter">
                      <Route index element={<PowerMeters />} />
                      <Route path="new" element={<PowerMeterNew />} />
                      <Route path=":powerMeterId">
                        <Route index element={<PowerMeter />} />
                        <Route path="settings" element={<DeviceSettings />} />
                      </Route>
                    </Route>

                    <Route path="WeatherStation">
                      <Route index element={<WeatherStations />} />
                      <Route path="new" element={<WeatherStationNew />} />
                      <Route path=":weatherStationId">
                        <Route index element={<WeatherStation />} />
                        <Route path="settings" element={<DeviceSettings />} />
                      </Route>
                    </Route>
                  </Route>
                </Route>
              </Route>
            </Route>
            <Route path="users">
              <Route index element={<Users />} />
              <Route path="new" element={<UserNew />} />
              <Route path=":userId">
                <Route index element={<User />} />
              </Route>
            </Route>
          </Route>

          <Route path="central-monitor">
            <Route index element={<Navigate to="fleetview" />} />
            <Route path="fleetview" element={<Fleetview />} />
            <Route path="site-list" element={<SiteList />} />
          </Route>

          <Route path="site-monitor">
            <Route index element={<Navigate to="site-view" />} />
            <Route path="site-view">
              <Route index element={<ViewSites />} />
              <Route path=":siteId" element={<ViewSite />} />
            </Route>
          </Route>

          <Route path="reports">
            <Route index element={<Navigate to="site-report" />} />
            <Route path="site-report" element={<SiteReport />} />
            <Route path="device-report" element={<DeviceReport />} />
          </Route>

          <Route path="/test" element={<Test />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Stack>
  );
}

export default React.memo(Main);
