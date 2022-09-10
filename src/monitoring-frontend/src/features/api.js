import { useQuery, useMutation, useQueryClient, useQueries } from "react-query";
import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.baseURL = baseURL + "/api";

const getData = (res) => res.data;

const addEntity = (entity) => {
  return axios.post("/entity", entity).then(getData);
};

const getEntity = ({ queryKey }) => {
  const query = queryKey[1];
  const fields = queryKey[2];
  const options = queryKey[3];
  return axios
    .get("/entity", { params: { query, fields, options } })
    .then(getData);
};

const getEntityById = ({ queryKey }) => {
  const id = queryKey[1];
  const fields = queryKey[2];
  const options = queryKey[3];
  return axios
    .get(`/entity/${id}`, { params: { fields, options } })
    .then(getData);
};

const updateEntity = (arg) =>
  axios.patch(`/entity/${arg[0]}`, arg[1]).then(getData);

export const useAddEntity = (key, config) => {
  const queryClient = useQueryClient();

  return useMutation(addEntity, {
    onSuccess() {
      queryClient.invalidateQueries(["entity", ...key]);
      if (config?.onSuccess) config.onSuccess();
    },
  });
};
export const useGetEntity = (key, config) =>
  useQuery(["entity", ...key], getEntity, config);
export const useGetEntityById = (key, config) =>
  useQuery(["entity", ...key], getEntityById, config);
export const useUpdateEntity = () => useMutation(updateEntity);

const deleteEntity = (entityId) => {
  return axios.delete(`/entity/${entityId}`).then(getData);
};
export const useDeleteEntity = (config) => {
  const queryClient = useQueryClient();
  return useMutation(deleteEntity, {
    onSuccess() {
      queryClient.invalidateQueries(["entity"]);
      if (config?.onSuccess) config.onSuccess();
    },
  });
};

const getRecord = ({ queryKey }) => {
  const query = queryKey[1];
  return axios.get("/record", { params: query }).then(getData);
};
export const useGetRecord = (key, config) =>
  useQuery(["record", ...key], getRecord, config);
export const useGetRecords = (key, config) => {
  const results = useQueries(
    key[0].map(([entityId, field]) => ({
      queryKey: [
        "record",
        {
          entityId: entityId,
          field: field,
          unit: key[1].unit,
          operator: key[1].operator,
          from: key[1].from,
          to: key[1].to,
        },
      ],
      queryFn: getRecord,
      enabled: config.enabled,
    }))
  );

  if (results.every((result) => result.isSuccess)) {
    let values = {};

    for (const result of results) {
      let records = result.data;
      for (const record of records) {
        const { timestamp, value } = record;
        if (values.hasOwnProperty(timestamp)) {
          values[timestamp] = values[timestamp] + value;
        } else {
          values[timestamp] = value;
        }
      }
    }

    return Object.entries(values).map(([key, value]) => ({ x: key, y: value }));
  } else return [];
};

//

//

//

//

//
const deleteRecord = (entityId) => {
  return axios
    .delete(`/record`, { params: { entityId: entityId } })
    .then(getData);
};
export const useDeleteRecord = (config) => {
  const queryClient = useQueryClient();
  return useMutation(deleteRecord, {
    onSuccess() {
      queryClient.invalidateQueries(["record"]);
      if (config?.onSuccess) config.onSuccess();
    },
  });
};

const addUser = (user) => {
  return axios.post("/user", user).then(getData);
};
export const useAddUser = (config) => {
  const queryClient = useQueryClient();
  return useMutation(addUser, {
    onSuccess() {
      queryClient.invalidateQueries(["user"]);
      if (config?.onSuccess) config.onSuccess();
    },
  });
};

const getUser = () => {
  return axios.get("/user").then(getData);
};
export const useGetUser = (config) => {
  return useQuery(["user"], getUser, config);
};
const deleteUser = (userId) => {
  return axios.delete(`/user/${userId}`).then(getData);
};
export const useDeleteUser = (config) => {
  const queryClient = useQueryClient();
  return useMutation(deleteUser, {
    onSuccess() {
      queryClient.invalidateQueries(["user"]);
      if (config?.onSuccess) config.onSuccess();
    },
  });
};

const getAuth = () => {
  console.log("getAuth");
  // return axios.get("/auth").then(getData);

  return {
    _id: "62d790ef44a5f194d51d423f",
    username: "admin",
    email: "minhtaile2712@gmail.com",
    role: "admin",
    __v: 0,
  };
};
export const useGetAuth = (config) => {
  return useQuery(["auth"], getAuth, config);
};
const loginAuth = (user) => {
  return axios.post("/auth/login", user).then(getData);
};
export const useLoginAuth = (config) => {
  const queryClient = useQueryClient();
  return useMutation(loginAuth, {
    onSuccess() {
      queryClient.invalidateQueries(["auth"]);
      if (config?.onSuccess) config.onSuccess();
    },
  });
};
const logoutAuth = () => {
  return axios.get("/auth/logout").then(getData);
};
export const useLogoutAuth = (config) => {
  const queryClient = useQueryClient();
  return useMutation(logoutAuth, {
    onSuccess() {
      queryClient.invalidateQueries(["auth"]);
      if (config?.onSuccess) config.onSuccess();
    },
  });
};
