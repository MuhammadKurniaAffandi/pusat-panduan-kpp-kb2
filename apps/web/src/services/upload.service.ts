import api from "@/lib/api";

export const uploadService = {
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<{ success: boolean; url: string }>(
      "/upload/image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { url: response.data.url };
  },
};
