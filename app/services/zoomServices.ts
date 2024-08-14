import axios from "axios";

export interface RegistrationResponse {
  id: number;
  join_url: string;
  registrant_id: string;
  start_time: string;
  topic: string;
}

export interface Webinar {
  created_at: string;
  duration: number;
  host_id: string;
  id: number;
  is_simulive: boolean;
  join_url: string;
  start_time: string;
  timezone: string;
  topic: string;
  type: number;
  uuid: string;
}

export interface WebinarDetail {
  uuid: string;
  id: number;
  host_id: string;
  host_email: string;
  topic: string;
  type: number;
  duration: number;
  timezone: string;
  agenda: string;
  created_at: string;
  start_url: string;
  join_url: string;
  registration_url: string;
  password: string;
  h323_passcode: string;
  encrypted_passcode: string;
  is_simulive: boolean;
}

export const getAccessToken = async ({
  zoomApiAccountId,
  zoomApiClientId,
  zoomApiClientSecret,
}: {
  zoomApiAccountId: string;
  zoomApiClientId: string;
  zoomApiClientSecret: string;
}): Promise<string> => {
  return await axios
    .post("https://zoom.us/oauth/token", null, {
      params: {
        grant_type: "account_credentials",
        account_id: zoomApiAccountId,
      },
      auth: {
        username: zoomApiClientId!,
        password: zoomApiClientSecret!,
      },
      timeout: 3000,
    })
    .then((response) => {
      return response.data.access_token;
    })
    .catch((error) => {
      let errorMessage = "Failed to fetch access token";
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage =
            error.response.data?.messager ||
            error.response.data ||
            error.message;
        } else {
          errorMessage = error.message;
        }
      }

      console.error("Error fetching access token:", errorMessage);
      throw new Error(errorMessage);
    });
};

export const getWebinars = async (accessToken: string): Promise<Webinar[]> => {
  try {
    const response = await axios.get(`https://zoom.us/v2/users/me/webinars`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const webinars: Webinar[] = response.data.webinars;
    const now = new Date();
    const filteredWebinars: Webinar[] = webinars.filter(
      (webinar) => new Date(webinar.start_time) >= now
    );
    return filteredWebinars;
  } catch (error) {
    let errorMessage = "Failed to fetch webinars";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage =
          error.response.data?.messager || error.response.data || error.message;
      } else {
        errorMessage = error.message;
      }
    }

    console.error("Error fetching webinars:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const getWebinar = async (
  accessToken: string,
  webinarId: string
): Promise<WebinarDetail> => {
  try {
    const response = await axios.get(
      `https://zoom.us/v2/webinars/${webinarId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    let errorMessage = "Failed to fetch webinar";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage =
          error.response.data?.messager || error.response.data || error.message;
      } else {
        errorMessage = error.message;
      }
    }

    console.error("Error fetching webinar:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const addWebinarRegistrant = async ({
  firstName,
  lastName,
  email,
  accessToken,
  webinarId,
}: {
  firstName: string;
  lastName: string;
  email: string;
  accessToken: string;
  webinarId: string;
}): Promise<RegistrationResponse | null> => {
  try {
    const res = await axios.post(
      `https://zoom.us/v2/webinars/${webinarId}/registrants`,
      {
        email,
        first_name: firstName,
        last_name: lastName,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("zoom registration response: ", res);

    return res.data;
  } catch (error) {
    // let errorMessage = "Failed to add webinar registrant";
    // if (axios.isAxiosError(error)) {
    //   if (error.response) {
    //     errorMessage =
    //       error.response.data?.messager || error.response.data || error.message;
    //   } else {
    //     errorMessage = error.message;
    //   }
    // }
    console.error("Error adding webinar registrant:", error);
    return null;
  }
};
