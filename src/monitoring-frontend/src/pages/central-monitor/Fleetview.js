import React from "react";

import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Last7dChart from "./Last7dChart";
import Last24hChart from "./Last24hChart";
import Map from "../../components/Map";

import { Button, Box, Stack } from "@mui/material";

import { useNavigate } from "react-router-dom";

import SampleSiteImage1 from "../../images/sample-site-image-1.jpg";
import { useGetAuth, useGetEntity } from "../../features/api";

const images = [
  {
    label: "San Francisco – Oakland Bay Bridge, United States",
    path: SampleSiteImage1,
  },
  { label: "Bird", path: SampleSiteImage1 },
  { label: "Bali, Indonesia", path: SampleSiteImage1 },
  { label: "Goč, Serbia", path: SampleSiteImage1 },
];

function Lcd7Seg(props) {
  return (
    <Box
      className="LCD7Seg"
      component="span"
      fontSize={28}
      color="primary.main"
    >
      {props.children}
    </Box>
  );
}

function Fleetview() {
  const navigate = useNavigate();

  const { data: auth, isSuccess } = useGetAuth();

  const { data: sites } = useGetEntity([{ type: "Site", refUser: auth._id }], {
    initialData: [],
    enabled: isSuccess,
  });

  return (
    <Stack flex={1} overflow="auto">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding={1}
        flexWrap="wrap"
      >
        <Button onClick={() => navigate("../site-list")}>Site List</Button>
        <Box>
          <Box component="span">Sites: </Box>
          <Lcd7Seg>{sites.length}</Lcd7Seg>
        </Box>

        <Box component="span">
          Fleet Capacity:
          <Lcd7Seg>
            {sites
              .map((site) => site.capacity?.value || 0)
              .reduce((prev, cur) => prev + cur, 0)}
          </Lcd7Seg>
          {sites[0]?.capacity.unit}
        </Box>
        <Box component="span">
          Total Production: <Lcd7Seg>--</Lcd7Seg> GWh
        </Box>
      </Box>

      <Box flex={{ md: 1 }} overflow={{ md: "auto" }} display={{ md: "flex" }}>
        <Box height={{ xs: 300, md: "auto" }} flex={{ md: 1 }}>
          <Map
            longtitude={sites[0]?.longtitude?.value}
            latitude={sites[0]?.latitude?.value}
          />
        </Box>
        <Box width={{ md: 400 }} overflow={{ md: "auto" }}>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <Box
                  component="img"
                  height={300}
                  width="100%"
                  src={image.path}
                  alt={image.label}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <Last24hChart />
          <Last7dChart />
        </Box>
      </Box>
    </Stack>
  );
}

export default Fleetview;
