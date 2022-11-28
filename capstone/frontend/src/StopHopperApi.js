/**
 * Perform a login
 *
 * loginDetails
 * {
 *  username: string,
 *  password: string
 * }
 *
 * @param loginDetails the username/password to attempt a login with
 * @returns {Promise<Response>}
 */
async function token(loginDetails) {
    return await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginDetails),
    });
}

/**
 * Perform a login and store access/refresh tokens in local storage
 *
 * loginDetails
 * {
 *  username: string,
 *  password: string
 * }
 *
 * @param loginDetails the username/password to attempt a login with
 * @returns {Boolean} true/false if login succeeded or not
 */
export async function performLogin(loginDetails) {
    const response = await token(loginDetails);
    const json = await response.json();

    console.log("Login Response:" + response);
    console.log("Login Response JSON:" + JSON.stringify(json));

    if (response.ok) {
        console.log("Login OK");
        localStorage.setItem("accessToken", JSON.stringify(json['access']));
        localStorage.setItem("refreshToken", JSON.stringify(json['refresh']));
        return true;
    } else {
        return false;
    }
}

/**
 * Register a new account, will not perform a login.
 *
 * accountDetails
 * {
 *  username: string,
 *  password: string
 * }
 *
 * @param accountDetails the username/password/email of the new account
 * @returns {Promise<Response>} the response of the API call
 */
export async function performRegister(accountDetails) {
    return await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(accountDetails),
    });
}

/**
 * Get the past routes a user has taken from SQL
 *
 * {
 *  {
 *   id: int
 *   routeCode: string
 *   user_id: int
 *  },
 *  ...
 * }
 *
 * @returns {Promise<Response>}
 */
export async function getFavRoutes() {
    return fetch("http://127.0.0.1:8000/api/getRoutes/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
            },
        })
}

/**
 * Submit stops to be added to the database with their preferences.
 *
 * Stops:
 * {
 *  {
 *   Stop: string,
 * 	 Priority: int,
 * 	 ArriveBy: string,
 * 	 TaskName: string,
 *  },
 *  ...
 * }
 *
 * No data is returned with the response.
 *
 * @param stops a list of stops to submit
 * @returns {Promise<Response>}
 */
export async function submitStop(stops) {
    return fetch("http://127.0.0.1:8000/api/submitStop/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
        },
        body: JSON.stringify(stops),
    });
}