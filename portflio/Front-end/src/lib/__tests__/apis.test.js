import axios from "axios";
import * as apis from "../apis";

jest.mock("axios");

describe("apis.js", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchUsers", () => {
    it("returns user data on success", async () => {
      const mockData = { data: [{ id: 1, name: "User" }] };
      axios.get.mockResolvedValueOnce({ data: { data: [mockData.data[0]] } });
      const result = await apis.fetchUsers();
      expect(result).toEqual(mockData.data[0]);
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/users"));
    });

    it("throws and logs error on failure", async () => {
      const error = new Error("fail");
      axios.get.mockRejectedValueOnce(error);
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      await expect(apis.fetchUsers()).rejects.toThrow(error);
      expect(spy).toHaveBeenCalledWith("Error fetching user:", error);
      spy.mockRestore();
    });
  });

  // Example for fetchProjects
  if (typeof apis.fetchProjects === "function") {
    describe("fetchProjects", () => {
      it("returns projects on success", async () => {
        const mockProjects = [{ id: 1, title: "Project" }];
        axios.get.mockResolvedValueOnce({ data: { data: mockProjects } });
        const result = await apis.fetchProjects();
        expect(result).toEqual(mockProjects);
      });

      it("throws and logs error on failure", async () => {
        const error = new Error("fail");
        axios.get.mockRejectedValueOnce(error);
        const spy = jest.spyOn(console, "error").mockImplementation(() => {});
        await expect(apis.fetchProjects()).rejects.toThrow(error);
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
      });
    });
  }

  // Example for createProject
  if (typeof apis.createProject === "function") {
    describe("createProject", () => {
      it("posts and returns data on success", async () => {
        const mockProject = { title: "New Project" };
        axios.post.mockResolvedValueOnce({ data: { data: mockProject } });
        const result = await apis.createProject(mockProject);
        expect(result).toEqual(mockProject);
        expect(axios.post).toHaveBeenCalled();
      });

      it("throws and logs error on failure", async () => {
        const error = new Error("fail");
        axios.post.mockRejectedValueOnce(error);
        const spy = jest.spyOn(console, "error").mockImplementation(() => {});
        await expect(apis.createProject({})).rejects.toThrow(error);
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
      });
    });
  }

  // Example for updateProject
  if (typeof apis.updateProject === "function") {
    describe("updateProject", () => {
      it("puts and returns data on success", async () => {
        const mockProject = { title: "Updated Project" };
        axios.put.mockResolvedValueOnce({ data: { data: mockProject } });
        const result = await apis.updateProject("id", mockProject);
        expect(result).toEqual(mockProject);
        expect(axios.put).toHaveBeenCalled();
      });

      it("throws and logs error on failure", async () => {
        const error = new Error("fail");
        axios.put.mockRejectedValueOnce(error);
        const spy = jest.spyOn(console, "error").mockImplementation(() => {});
        await expect(apis.updateProject("id", {})).rejects.toThrow(error);
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
      });
    });
  }

  // Example for deleteProject
  if (typeof apis.deleteProject === "function") {
    describe("deleteProject", () => {
      it("deletes and returns data on success", async () => {
        axios.delete.mockResolvedValueOnce({ data: { success: true } });
        const result = await apis.deleteProject("id");
        expect(result).toEqual({ success: true });
        expect(axios.delete).toHaveBeenCalled();
      });

      it("throws and logs error on failure", async () => {
        const error = new Error("fail");
        axios.delete.mockRejectedValueOnce(error);
        const spy = jest.spyOn(console, "error").mockImplementation(() => {});
        await expect(apis.deleteProject("id")).rejects.toThrow(error);
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
      });
    });
  }
});
