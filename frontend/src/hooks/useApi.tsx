import { useState } from "react";
import axios, { Method } from "axios";
import { useSnackbar } from "../context/snackbar-context";
import { useErrorBoundary } from "react-error-boundary";

interface ApiRequestParams {
  method: Method;
  url: string;
  queryParams?: string;
  payload?: any;
}

export const useApi = () => {
  const { showMessage } = useSnackbar();
  const { showBoundary } = useErrorBoundary();
  const [responseData, setResponseData] = useState<any>(null);

  const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000/api";

  const fetchData = async (endpoint: string) => {
    try {
      const response = await axios.get(`${baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setResponseData(response.data);
      return response.data;
    } catch (error: any) {
      showBoundary(error);
      throw error;
    }
  };

  const saveData = async (params: ApiRequestParams) => {
    const { method, url, queryParams = "", payload = {} } = params;
    try {
      const response = await axios({
        method,
        url: `${baseUrl}${url}${queryParams}`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setResponseData(response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error in saveData:" ,error)
    }
  };

  const deleteData = async (url: string) => {
    try {
      const response = await axios.delete(`${baseUrl}${url}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setResponseData(response.data);
      return response.data;
    } catch (error: any) {
    //   showBoundary(error);
    //   throw error;
    }
  };

  return { fetchData, saveData, deleteData, responseData };
};
