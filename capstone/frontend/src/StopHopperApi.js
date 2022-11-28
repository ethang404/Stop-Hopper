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