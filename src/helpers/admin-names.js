import { API } from "../services/services";

let cachedAdmins = null;
let fetchPromise = null;

export async function fetchAdmins() {
  if (cachedAdmins) return cachedAdmins;

  if (!fetchPromise) {
    fetchPromise = (async () => {
      try {
        const res = await API.post('user/admins');
        const admins = await res.data;
        cachedAdmins = admins.map(admin => admin.nick);
        return cachedAdmins;
      } catch (error) {
        console.error('Ha habido un error obteniendo los admins:', error);
        throw error;
      } finally {
        fetchPromise = null;
      }
    })();
  }

  return fetchPromise;
}