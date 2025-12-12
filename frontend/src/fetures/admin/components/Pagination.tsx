import { useState, useEffect, useCallback } from "react";

interface Props {
    page: number;
    lastPage: number;
    onChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ page, lastPage, onChange }) => {

    const [pages, setPages] = useState<(number | string)[]>([]);


     const generatePages = useCallback(() => {
        const totalPages = lastPage;
        const current = page;
        const visible: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) visible.push(i);
        } else if (current <= 4) {
            visible.push(1, 2, 3, 4, 5, "...", totalPages);
        } else if (current >= totalPages - 3) {
            visible.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            visible.push(1, "...", current - 1, current, current + 1, "...", totalPages);
        }

        setPages(visible);
    }, [page, lastPage]);

    useEffect(() => {
        generatePages();
    }, [generatePages]);


    

    const goToPage = (p: number) => {
        if (p < 1 || p > lastPage) return;
        onChange(p);
    };

    return (
        <div className="max-w-screen-xl mx-auto mt-12 px-4 text-gray-600 md:px-8">
        
            <div className="hidden justify-between text-sm md:flex">
                <div>
                    Página {page} de {lastPage}
                </div>

                <div className="flex items-center gap-12" aria-label="Pagination">
                    <button
                        className="hover:text-indigo-600"
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>

                    <ul className="flex items-center gap-1">
                        {pages.map((item, idx) => (
                            <li key={idx}>
                                {item === "..." ? (
                                    <span className="px-3 py-2">...</span>
                                ) : (
                                    <button
                                        onClick={() => goToPage(item as number)}
                                        className={`px-3 py-2 rounded-lg duration-150 
                                            hover:text-white hover:bg-indigo-600
                                            ${page === item ? "bg-indigo-600 text-white font-medium" : ""}`}
                                    >
                                        {item}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>

                    <button
                        className="hover:text-indigo-600"
                        onClick={() => goToPage(page + 1)}
                        disabled={page === lastPage}
                    >
                        Next
                    </button>
                </div>
            </div>

      
            <div className="flex items-center justify-between text-sm text-gray-600 font-medium md:hidden">
                <button
                    className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </button>

                <div className="font-medium">
                    Página {page} de {lastPage}
                </div>

                <button
                    className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50"
                    onClick={() => goToPage(page + 1)}
                    disabled={page === lastPage}
                >
                    Next
                </button>
            </div>
        </div>
    );
};
export default Pagination;
