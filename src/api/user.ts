import { User } from "@/types/user";
import { request } from "./index";

export const getAllUsers = (data: {
  pageNum: number;
  pageSize: number;
  keyWord: string;
}) => {
  return request.get<{
    data: User[];
    total: number;
  }>("/api/user", {
    params: data,
  });
};

export const createUser = (data: Omit<User, "id">) => {
  return request.post<{
    data: User[];
    total: number;
  }>("/api/user", {
    data,
  });
};
export const updateUser = (data: Partial<User>) => {
  return request.patch<{
    data: User[];
    total: number;
    id: number;
  }>(`/api/user/${data.id}`, {
    data,
  });
};

export const deleteUser = (id: number) => {
  return request.delete<{
    data: User[];
    total: number;
    id: number;
  }>(`/api/user/${id}`);
};
