interface PaginationProps {
    previousPage?: string;
    onHandlePrevious: VoidFunction;
    onHandleNext?: VoidFunction;
}

export const Pagination = ({ previousPage, onHandlePrevious, onHandleNext }: PaginationProps) => {
    return (
        <>
            <label className={`
            mr-2 ${Boolean(previousPage) 
                    ? "text-blue-600 hover:text-blue-800 cursor-pointer dark:text-white"
                    : "text-gray-500 dark:text-white"}
        `}
                onClick={Boolean(previousPage) ? onHandlePrevious : () => { }}
            >
                {'<<'} Anterior
            </label>
            <label className="text-blue-600 dark:text-white">||</label>
            <label
                className= " mr-2text-blue-600 hover:text-blue-800 cursor-pointer dark:text-white"
                onClick={onHandleNext}
             >
              Próximo {'>>'} 
            </label>
        </>
    )
}
