import axios from "axios";

const api = axios.create({
  baseURL: "https://cpe-workshop-ie.amiearth.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

api.interceptors.request.use(
  (config: any): any => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any): Promise<any> => {
    const errorMessage = error.message || "เกิดข้อผิดพลาดในการส่งคำขอ";
    return Promise.reject(errorMessage);
  }
);

api.interceptors.response.use(
  (response: any): any => {
    return response.data;
  },
  async (error: any): Promise<any> => {
    let errorMessage = "เกิดข้อผิดพลาดในการเชื่อมต่อ";
    const originalRequest = error.config;

    if (error.response) {
      errorMessage = error.response.data?.message || errorMessage;

      if (
        error.response.status === 401 &&
        !originalRequest._retry &&
        !isRefreshing
      ) {
        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem("refresh_token");

        if (refreshToken) {
          try {
            const response: any = await api.post("/user/refresh", {
              refresh_token: refreshToken,
            });

            localStorage.setItem("access_token", response.access_token);
            localStorage.setItem("refresh_token", response.refresh_token);

            originalRequest.headers.Authorization = `Bearer ${response.access_token}`;

            isRefreshing = false;

            return axios(originalRequest);
          } catch (refreshError) {
            isRefreshing = false;
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");

            if (!window.location.pathname.includes("/login")) {
              window.location.href = "/login";
            }

            return Promise.reject(
              "หมดเวลาเข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่อีกครั้ง"
            );
          }
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");

          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
        }
      } else if (error.response.status === 401) {
        if (!window.location.pathname.includes("/login")) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      }
    } else if (error.request) {
      errorMessage = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้";
    } else {
      errorMessage = error.message || errorMessage;
    }

    return Promise.reject(errorMessage);
  }
);

export const login = (email: string, password: string): Promise<any> => {
  try {
    return api.post("/user/login", { email, password });
  } catch (error) {
    const errorMessage =
      (error as Error).message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
    return Promise.reject(errorMessage);
  }
};

export const register = (
  name: string,
  email: string,
  password: string
): Promise<any> => {
  try {
    return api.post("/user/register", { name, email, password });
  } catch (error) {
    const errorMessage =
      (error as Error).message || "เกิดข้อผิดพลาดในการสมัครสมาชิก";
    return Promise.reject(errorMessage);
  }
};

export const getProfile = (): Promise<any> => {
  try {
    return api.get("/user/profile");
  } catch (error) {
    const errorMessage =
      (error as Error).message || "เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์";
    return Promise.reject(errorMessage);
  }
};

export const logout = (): Promise<any> => {
  try {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return api.get("/user/logout");
  } catch (error) {
    const errorMessage =
      (error as Error).message || "เกิดข้อผิดพลาดในการออกจากระบบ";
    return Promise.reject(errorMessage);
  }
};

export const refreshToken = (refreshToken: string): Promise<any> => {
  try {
    return api.post("/user/refresh", { refresh_token: refreshToken });
  } catch (error) {
    const errorMessage =
      (error as Error).message || "เกิดข้อผิดพลาดในการรีเฟรชโทเค็น";
    return Promise.reject(errorMessage);
  }
};

export const googleLogin = (): Promise<any> => {
  try {
    return api.get("/user/google");
  } catch (error) {
    const errorMessage =
      (error as Error).message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google";
    return Promise.reject(errorMessage);
  }
};

export const getLedgers = (
  page: number = 1,
  limit: number = 10,
  filters: any = {}
): Promise<any> => {
  try {
    return api.get("/ledger", {
      params: {
        page,
        limit,
        ...filters,
      },
    });
  } catch (error) {
    const errorMessage =
      (error as Error).message || "เกิดข้อผิดพลาดในการดึงข้อมูลรายการ";
    return Promise.reject(errorMessage);
  }
};

export const getLedgerById = (id: string | number): Promise<any> => {
  try {
    return api.get(`/ledger/${id}`);
  } catch (error) {
    const errorMessage =
      (error as Error).message || "เกิดข้อผิดพลาดในการดึงข้อมูลรายการ";
    return Promise.reject(errorMessage);
  }
};

export const createLedger = (data: any): Promise<any> => {
  try {
    return api.post("/ledger", data);
  } catch (error) {
    const errorMessage =
      (error as Error).message || "เกิดข้อผิดพลาดในการสร้างรายการ";
    return Promise.reject(errorMessage);
  }
};

export const updateLedger = (id: string | number, data: any): Promise<any> => {
  try {
    return api.put(`/ledger/${id}`, data);
  } catch (error) {
    const errorMessage =
      (error as Error).message || "เกิดข้อผิดพลาดในการอัปเดตรายการ";
    return Promise.reject(errorMessage);
  }
};

export const deleteLedger = (id: string | number): Promise<any> => {
  try {
    return api.delete(`/ledger/${id}`);
  } catch (error) {
    const errorMessage =
      (error as Error).message || "เกิดข้อผิดพลาดในการลบรายการ";
    return Promise.reject(errorMessage);
  }
};

export const getCategories = (): Promise<any> => {
  try {
    return api.get("/ledger_category");
  } catch (error) {
    const errorMessage =
      (error as Error).message || "เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่";
    return Promise.reject(errorMessage);
  }
};

export const getDashboardData = (
  startDate?: string,
  endDate?: string
): Promise<any> => {
  try {
    return api.get("/dashboard", {
      params: {
        startDate,
        endDate,
      },
    });
  } catch (error) {
    const errorMessage =
      (error as Error).message || "เกิดข้อผิดพลาดในการดึงข้อมูลแดชบอร์ด";
    return Promise.reject(errorMessage);
  }
};
