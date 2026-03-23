import api from "./api";

const eventService = {

  getAllEvents: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/events/all`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur getAllEvents:", error);
      throw error;
    }
  },

  addEvent: async (formData) => {
    try {
      const response = await api.post("/events/add", formData);
      return response.data;
    } catch (error) {
      console.error("Erreur addEvent:", error);
      throw error;
    }
  },
getEventById: async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Une erreur est survenue";
    throw new Error(message);
  }
},
  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/events/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'event ${id}:`, error);
      throw error;
    }
  },
  getEventParticipants: async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/events/${eventId}/participants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteAllEvents: async () => {
    try {
      const response = await api.delete("/events/delete-all");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression massive:", error);
      const message = error.response?.data?.message || "Impossible de supprimer tous les événements";
      throw new Error(message);
    }
  },
};

export default eventService;