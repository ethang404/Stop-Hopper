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