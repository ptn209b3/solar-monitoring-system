import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";

import { useParams, useNavigate } from "react-router-dom";

import {
  Stack,
  Box,
  Container,
  Button,
  Typography,
  useMediaQuery,
  Grid,
} from "@mui/material";
import TableRowsIcon from "@mui/icons-material/TableRows";
import BarChartIcon from "@mui/icons-material/BarChart";

import {
  CustomToggleButton,
  CustomSelect,
  QueryTable,
  GenericChart,
  RealtimeChart,
  CustomDateTimePicker,
} from "../../components";
import { useGetRecord, useGetEntityById } from "../../features/api";
import {
  operators,
  timeUnitOptions,
  pickerUnitOptions,
} from "../../features/constants";
// import { makeChartData, makeChartLabel } from "../../features/lib";

dayjs.extend(utc);

const showOptions = [
  { value: false, Icon: TableRowsIcon },
  { value: true, Icon: BarChartIcon },
];

const columns = [
  { field: "value", headerName: "Value", width: 200 },
  {
    field: "timestamp",
    headerName: "Timestamp",
    width: 200,
  },
];

export default function GenericDevice({ deviceType }) {
  const navigate = useNavigate();
  const { value: typeValue, label: typeLabel } = deviceType;
  const params = useParams();
  const genericDeviceId =
    params[typeValue.charAt(0).toLowerCase() + typeValue.slice(1) + "Id"];
  const { data: entity } = useGetEntityById([genericDeviceId], {
    initialData: null,
  });
  const [fields, setFields] = React.useState({});
  const fieldOptions = Object.keys(fields).map((key) => ({
    value: key,
    label: key,
  }));

  React.useEffect(() => {
    if (entity) {
      let newFields = {};
      for (const key in entity) {
        const field = entity[key];
        if (typeof field === "object" && field.type === "number")
          newFields[key] = [genericDeviceId, key];
        if (typeof field === "object" && field.type === "link")
          newFields[key] = field.value.split(".");
      }
      setFields(newFields);
    }
  }, [genericDeviceId, entity]);

  const [timeUnit, setTimeUnit] = React.useState("year");
  const pickerUnit = pickerUnitOptions[timeUnit];

  const [date, setDate] = React.useState(dayjs());

  const [selectedField, setSelectedField] = React.useState("");
  const [operator, setOperator] = React.useState("");
  const [showChart, setShowChart] = React.useState(false);

  const [query, setQuery] = React.useState({});
  const [ready, setReady] = React.useState(false);

  function handleApply() {
    const nextQuery = {
      entityId: fields[selectedField][0],
      field: fields[selectedField][1],
      ...(operator !== "all" && {
        unit: timeUnit,
        operator: operator,
      }),
      ...(pickerUnit && {
        from: date.startOf(pickerUnit).toISOString(),
        to: date.endOf(pickerUnit).toISOString(),
      }),
    };
    setQuery(nextQuery);
    setReady(true);
  }

  const queryProps = useGetRecord([query], {
    initialData: [],
    enabled: ready,
  });

  const onDesktop = useMediaQuery("(min-width:600px)");

  function handleExport() {
    const EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const EXCEL_EXTENSION = ".xlsx";
    const fileName = "fileName";

    const jsonData = queryProps.data;
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    const data = new Blob([excelBuffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  let canApply = timeUnit && selectedField && operator;

  // const series = [
  //   { data: makeChartData(queryProps.data, timeUnit), name: selectedField },
  // ];
  const series = [
    {
      data: queryProps.data.map((point) => ({
        x: point.timestamp,
        y: point.value,
      })),
    },
  ];
  // const options = {
  //   chart: {
  //     type: "line",
  //     zoom: { enabled: false },
  //     animations: { enabled: false },
  //   },
  //   labels: makeChartLabel(queryProps.data, timeUnit),
  // };
  const options = {
    xaxis: { type: "datetime" },
  };

  return (
    <Box sx={{ height: 1, bgcolor: "background.default", overflow: "auto" }}>
      <Container fixed>
        <Stack spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">{typeLabel} Overview</Typography>
            <Button onClick={() => navigate("settings")}>Settings</Button>
          </Stack>

          <Grid container>
            {Object.keys(fields).map((key) => (
              <Grid key={fields[key][1]} item xs={12} md={6}>
                <Box height={350}>
                  <RealtimeChart
                    entityId={fields[key][0]}
                    field={fields[key][1]}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>

          <Stack direction="row" spacing={1} alignItems="center">
            <CustomToggleButton
              options={timeUnitOptions}
              value={timeUnit}
              setValue={setTimeUnit}
            />

            {pickerUnit && (
              <CustomDateTimePicker
                value={date}
                setValue={setDate}
                unit={pickerUnit}
              />
            )}
          </Stack>

          <Stack direction={onDesktop ? "row" : "column"} spacing={1}>
            <CustomSelect
              options={fieldOptions}
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              label="Field"
              fullWidth
            />
            <CustomSelect
              options={operators}
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              label="Operator"
              fullWidth
            />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>Display:</Typography>
            <CustomToggleButton
              options={showOptions}
              value={showChart}
              setValue={setShowChart}
            />
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              onClick={handleApply}
              variant="contained"
              disabled={!canApply}
            >
              Apply
            </Button>
            <Button variant="contained" onClick={handleExport}>
              Export
            </Button>
          </Stack>

          <Box height={onDesktop ? 400 : 300}>
            {showChart ? (
              <GenericChart series={series} options={options} />
            ) : (
              <QueryTable
                queryProps={queryProps}
                tableProps={{ columns, getRowId: (row) => row.timestamp }}
                height={400}
              />
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
