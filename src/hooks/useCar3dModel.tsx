import { useQuery } from "@tanstack/react-query";
import { getCar3dModelByName } from "../api/car";

export const useCar3dModel = (carName: string) => {
  return useQuery({
    queryKey: ["car-3d-model", carName],
    queryFn: () => getCar3dModelByName(carName),
    staleTime: 60 * 60 * 1000,
  });
};
