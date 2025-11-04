import type { TasksPaginationMeta } from "@/types/tasks/get-pagination-tasks";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type metaDados = {
  size: string;
  onSizeChange: (value: string) => void;
  page: string;
  setPage: Dispatch<SetStateAction<string>>;
  paginationItem: TasksPaginationMeta;
};

export function Pagination({
  size,
  onSizeChange,
  page,
  setPage,
  paginationItem,
}: metaDados) {
  function firstPage() {
    setPage("1");
  }

  function previousPage() {
    if (Number(page) > 1) {
      setPage(String(Number(page) - 1));
    }
  }

  function nextPage() {
    if (Number(page) < Number(paginationItem.totalPages)) {
      setPage(String(Number(page) + 1));
    }
  }

  function lastPage() {
    setPage(String(paginationItem.totalPages));
  }
  const isFirstPage = Number(paginationItem.currentPage) === 1;
  const isLastPage =
    Number(paginationItem.currentPage) === Number(paginationItem.totalPages);
  return (
    <div className="w-full flex items-center text-sm justify-between">
      <span>
        Mostrando {paginationItem.itemsPerPage} de {paginationItem.totalItem}{" "}
        itens
      </span>

      <div className="flex items-center gap-12">
        <div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span>Tarefas por página</span>
              <Select value={size} onValueChange={onSizeChange}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder={size} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={"secondary"}
            onClick={firstPage}
            disabled={isFirstPage}
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant={"secondary"}
            onClick={previousPage}
            disabled={isFirstPage}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant={"secondary"}
            onClick={nextPage}
            disabled={isLastPage}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant={"secondary"}
            onClick={lastPage}
            disabled={isLastPage}
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
