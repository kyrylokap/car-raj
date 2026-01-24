import { useEffect, useState } from "react";
import { Filter } from "../api/car";

const defaultFilters: Filter = {
  brand: "",
  model: "",
  minPrice: "",
  maxPrice: "",
  minYear: "",
  maxYear: "",
  fuelType: "",
  location: "",
  minMileage: "",
  maxMileage: "",
  transmission: "",
  sortBy: "",
};

export function useSearchFilters() {
  const [draftFilters, setDraftFilters] = useState<Filter>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filter | undefined>(
    undefined,
  );

  useEffect(() => {
    if (draftFilters.sortBy !== (appliedFilters?.sortBy ?? "")) {
      setAppliedFilters((prev) => ({
        ...(prev || defaultFilters),
        sortBy: draftFilters.sortBy,
      }));
    }
  }, [draftFilters.sortBy]);

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
  };

  const handleResetFilters = () => {
    setDraftFilters(defaultFilters);
    setAppliedFilters(undefined);
  };

  const updateDraftFilter = <K extends keyof Filter>(
    key: K,
    value: Filter[K],
  ) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  return {
    draftFilters,
    appliedFilters,
    applyFilters,
    handleResetFilters,
    updateDraftFilter,
  };
}
